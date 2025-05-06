import { View } from "./view.js"
import { initComponents } from "./view/components.js";
import * as Tone from "tone";
import { Midi } from '@tonejs/midi';
import { PLAY, PAUSE, FILE_SELECT, SLIDER_UPDATE, START_SLIDER_UPDATE, END_SLIDER_UPDATE } from "./view/components/full_screen_span/ui_bar.js";

export class Controller {
    view;
    midi = null;
    synth = null;
    noteEvents = [];
    startWindowTime = 0;
    endWindowTime = 5;
    songDuration = null;
    startWindowIndex = 0;
    animationFrameId = null;
    isPlaying = false; // Keep track of the play state
    wasPlaying = false;

    constructor() {
        this.view = new View();
    }

    initialize() {
        initComponents();

        document.addEventListener(FILE_SELECT, async (event) => {
            const file = event.detail.midiFile;
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        this.midi = new Midi(e.target.result);
                        console.log("Midi data loaded!");
                        this.noteEvents = [];
                        this.midi.tracks.forEach(track => track.notes.forEach(note => this.noteEvents.push(note)));
                        this.noteEvents.sort((a, b) => a.time - b.time || a.duration - b.duration || a.midi - b.midi);
                        console.log("noteEvents:", [this.noteEvents[0], this.noteEvents[0].time, this.noteEvents[0].duration, this.noteEvents[0].ticks, this.noteEvents[0].durationTicks]);
                        this.startWindowTime = 0;
                        this.endWindowTime = 5;
                        this.startWindowIndex = 0;
                        const lastNote = this.noteEvents[this.noteEvents.length - 1];
                        this.songDuration = lastNote.time + lastNote.duration;
                    } catch (error) {
                        console.error("Error parsing MIDI:", error);
                        alert("Error parsing MIDI file. Please ensure it is a valid MIDI file.");
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        });

        const drawFrame = (view) => {
            view.clearNoteCanvas();

            // Find the starting index for notes within the current window
            while (this.startWindowIndex < this.noteEvents.length && this.noteEvents[this.startWindowIndex].time + this.noteEvents[this.startWindowIndex].duration < this.startWindowTime) {
                this.startWindowIndex++;
            }

            for (let i = this.startWindowIndex; i < this.noteEvents.length; i++) {
                const note = this.noteEvents[i];
                if (note.time + note.duration >= this.startWindowTime && note.time < this.endWindowTime) {
                    view.drawNote(this.startWindowTime, this.endWindowTime, Tone.getTransport().seconds, note);
                }
                if (note.time >= this.endWindowTime) {
                    break;
                }
            }

            view.drawPianoKeyboard();

            // Reached the end of the midi file
            if (this.startWindowIndex >= this.noteEvents.length && this.isPlaying) {
                console.log("Reached EOF");
                Tone.getTransport().cancel();
                Tone.getTransport().stop();
                this.isPlaying = false;
            }

            const elapsedTime = Tone.getTransport().seconds - this.startWindowTime;
            this.startWindowTime = Tone.getTransport().seconds;
            this.endWindowTime += elapsedTime;

            this.view.setSlider(100 * this.startWindowTime / this.songDuration, 100 * this.endWindowTime / this.songDuration);

            if (this.isPlaying) { // Only request animation frame if playing
                this.animationFrameId = requestAnimationFrame(() => drawFrame(view));
            }
        };

        document.addEventListener(PLAY, async () => {
            console.log("time", [Tone.getTransport().seconds]);
            if (this.midi) {
                if (!this.synth) {
                    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
                }

                if (!this.isPlaying) { // Only reset and schedule if not already playing
                    Tone.getTransport().cancel();
                    Tone.getTransport().stop();
                    Tone.getTransport().seconds = Tone.Time(this.startWindowTime).toSeconds(); // Set transport to current window start

                    try {
                        if (this.midi.header.tempos.length > 0) {
                            Tone.getTransport().bpm.value = this.midi.header.tempos[0].bpm;
                            this.view.setBPM(this.midi.header.tempos[0].bpm);
                        }

                        this.noteEvents.forEach((note) => {
                            Tone.getTransport().schedule((time) => {
                                this.synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
                            }, note.time);
                        });

                        if (this.animationFrameId) {
                            cancelAnimationFrame(this.animationFrameId);
                        }
                        this.isPlaying = true;
                        drawFrame(this.view);
                        Tone.getTransport().start();
                    } catch (error) {
                        console.error("Error playing MIDI:", error);
                        alert("Error playing MIDI. Please ensure the MIDI data is correct.");
                    }
                } else {
                    // If already playing, just resume the transport and animation
                    Tone.getTransport().start();
                    drawFrame(this.view);
                }
            } else {
                alert('Please select a MIDI file.');
            }
        });

        document.addEventListener(PAUSE, () => {
            console.log("time", [Tone.getTransport().seconds]);
            Tone.getTransport().pause();
            this.isPlaying = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        });

        document.addEventListener(SLIDER_UPDATE, (event) => {
            console.log("SLIDER_UPDATE");
            this.startWindowTime = event.detail.values[0] * this.songDuration / 100;
            Tone.getTransport().seconds = this.startWindowTime;
            this.endWindowTime = event.detail.values[1] * this.songDuration / 100;
            this.startWindowIndex = 0; // Reset the index when the window changes
            this.view.clearNoteCanvas(); // Optionally clear immediately for responsiveness
            drawFrame(this.view); // Force a redraw of the canvas
        });

        document.addEventListener(START_SLIDER_UPDATE, () => {
            this.wasPlaying = this.isPlaying;
            console.log("START_SLIDER_UPDATE");
            if (this.isPlaying) {
                const new_event = new CustomEvent(PAUSE, {
                    detail: {},
                    bubbles: true,
                    composed: true,
                });
                document.dispatchEvent(new_event);
            }
        });

        document.addEventListener(END_SLIDER_UPDATE, () => {
            console.log("END_SLIDER_UPDATE");
            if (this.wasPlaying) {
                const new_event = new CustomEvent(PLAY, {
                    detail: {},
                    bubbles: true,
                    composed: true,
                });
                document.dispatchEvent(new_event);
            }
        });
    }
}