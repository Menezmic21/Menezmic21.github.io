import { View } from "./view.js"
import { initComponents } from "./view/components.js";
import * as Tone from "tone";
import { Midi } from '@tonejs/midi';
import { PLAY, PAUSE, FILE_SELECT, SLIDER_UPDATE, START_SLIDER_UPDATE, END_SLIDER_UPDATE, SET_BPM } from "./view/components/full_screen_span/ui_bar.js";

export class Controller {
    view;
    midi = null;
    synth = null;
    noteEvents = [];
    startWindowTicks = 0;
    endWindowTicks = 5;
    songDurationTicks = null;
    startWindowIndex = 0;
    animationFrameId = null;
    isPlaying = false; // Keep track of the play state
    wasPlaying = false;
    customBPM = 120;

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
                        this.noteEvents.sort((a, b) => a.ticks - b.ticks || a.durationTicks - b.durationTicks || a.midi - b.midi);
                        // console.log("this.midi", [this.midi]);
                        Tone.getTransport().PPQ = this.midi.header.ppq;
                        this.customBPM = this.midi.header.tempos[0].bpm;
                        this.startWindowTicks = 0;
                        this.endWindowTicks = Tone.Time(5).toTicks();
                        this.startWindowIndex = 0;
                        const lastNote = this.noteEvents[this.noteEvents.length - 1];
                        this.songDurationTicks = lastNote.ticks + lastNote.durationTicks;
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
            while (this.startWindowIndex < this.noteEvents.length && this.noteEvents[this.startWindowIndex].ticks + this.noteEvents[this.startWindowIndex].durationTicks < this.startWindowTicks) {
                this.startWindowIndex++;
            }

            for (let i = this.startWindowIndex; i < this.noteEvents.length; i++) {
                const note = this.noteEvents[i];
                if (note.ticks + note.durationTicks >= this.startWindowTicks && note.ticks < this.endWindowTicks) {
                    view.drawNote(this.startWindowTicks, this.endWindowTicks, Tone.getTransport().ticks, note);
                }
                if (note.ticks >= this.endWindowTicks) {
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

            const elapsedTicks = Tone.getTransport().ticks - this.startWindowTicks;
            this.startWindowTicks = Tone.getTransport().ticks;
            this.endWindowTicks += elapsedTicks;

            this.view.setSlider(100 * this.startWindowTicks / this.songDurationTicks, 100 * this.endWindowTicks / this.songDurationTicks);

            if (this.isPlaying) { // Only request animation frame if playing
                this.animationFrameId = requestAnimationFrame(() => drawFrame(view));
            }
        };

        document.addEventListener(PLAY, async () => {
            console.log("ticks", [Tone.getTransport().ticks]);
            if (this.midi) {
                if (!this.synth) {
                    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
                }

                if (!this.isPlaying) { // Only reset and schedule if not already playing
                    Tone.getTransport().cancel();
                    Tone.getTransport().stop();
                    Tone.getTransport().seconds = Tone.Time(this.startWindowTicks, 'i').toSeconds(); // Set transport to current window start

                    try {
                        if (this.midi.header.tempos.length > 0) {
                            Tone.getTransport().bpm.value = this.customBPM;
                            this.view.setBPM(this.customBPM); // A bit silly since it will set bpm in ui bar which will come back and set bpm here. not an issue because it doesn't call play.
                        }

                        this.noteEvents.forEach((note) => {
                            Tone.getTransport().schedule((time) => {
                                this.synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
                            }, `${note.ticks}i`);
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
            console.log("ticks", [Tone.getTransport().ticks]);
            Tone.getTransport().pause();
            this.isPlaying = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        });

        document.addEventListener(SLIDER_UPDATE, (event) => {
            console.log("SLIDER_UPDATE");
            this.startWindowTicks = event.detail.values[0] * this.songDurationTicks / 100;
            Tone.getTransport().seconds = Tone.Time(this.startWindowTicks, 'i').toSeconds();
            this.endWindowTicks = event.detail.values[1] * this.songDurationTicks / 100;
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

        document.addEventListener(SET_BPM, (event) => {
            this.customBPM = event.detail.bpm;
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' && document.fullscreenElement !== null) {
                // The spacebar was pressed, and we are in fullscreen mode.
                if (this.isPlaying) {
                    const new_event = new CustomEvent(PAUSE, {
                        detail: {},
                        bubbles: true,
                        composed: true,
                    });
                    document.dispatchEvent(new_event);
                } else {
                    const new_event = new CustomEvent(PLAY, {
                        detail: {},
                        bubbles: true,
                        composed: true,
                    });
                    document.dispatchEvent(new_event);
                }
                this.view.updatePlayButton(this.isPlaying);
            }
        });

        // New Event Listener for Scroll in Fullscreen
        document.addEventListener('wheel', (event) => {
            if (document.fullscreenElement) {
                const percentY = -event.deltaY / window.screen.height;

                const ticksDiff = this.endWindowTicks - this.startWindowTicks;
                const ticksDelta = ticksDiff * percentY;
                this.startWindowTicks += ticksDelta;
                Tone.getTransport().seconds = Tone.Time(this.startWindowTicks, 'i').toSeconds();
                this.endWindowTicks += ticksDelta;
                this.startWindowIndex = 0; // Reset the index when the window changes
                this.view.clearNoteCanvas(); // Optionally clear immediately for responsiveness
                drawFrame(this.view); // Force a redraw of the canvas
            }
        }, { capture: true }); // Use capture phase to ensure we get the event first
    }
}