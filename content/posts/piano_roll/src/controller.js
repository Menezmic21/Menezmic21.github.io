import { View } from "./view.js"
import { initComponents } from "./view/components.js";
import * as Tone from "tone";
import { Midi } from '@tonejs/midi';
import { PLAY, PAUSE, FILE_SELECT } from "./view/components/full_screen_span/ui_bar.js";

export class Controller {
    view;
    midi = null;
    synth = null;
    noteEvents = [];
    startWindowTime = 0;
    endWindowTime = 5;
    startWindowIndex = 0;
    animationFrameId = null;

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
                        console.log("Midi data loaded!", JSON.stringify(this.midi, null, 2));

                        console.log("tracks", [this.midi.tracks]);

                        this.noteEvents = [];
                        this.midi.tracks.forEach(track => track.notes.forEach(note => this.noteEvents.push(note)));
                        this.noteEvents.sort((a, b) => a.time - b.time || a.duration - b.duration || a.midi - b.midi);
                        console.log("noteEvents", [this.noteEvents]);
                        this.startWindowTime = 0;
                        this.endWindowTime = 5;
                        this.startWindowIndex = 0;
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
                console.log("played", [this.noteEvents[this.startWindowIndex].name, this.noteEvents[this.startWindowIndex].midi, this.view.pianoRollCanvas.countWhiteKeys(0, this.noteEvents[this.startWindowIndex].midi)]);
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
            if (this.startWindowIndex >= this.noteEvents.length) {
                Tone.getTransport().cancel();
                Tone.getTransport().stop();
            }

            this.startWindowTime = Tone.getTransport().now();
            this.endWindowTime = this.startWindowTime + 5;

            this.animationFrameId = requestAnimationFrame(() => drawFrame(view));
        };

        document.addEventListener(PLAY, async () => {
            if (this.midi) {
                if (!this.synth) {
                    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
                }

                Tone.getTransport().cancel();
                Tone.getTransport().stop();

                Tone.getTransport().start();

                try {
                    if (this.midi.header.tempos.length > 0) {
                        Tone.getTransport().bpm.value = this.midi.header.tempos[0].bpm;
                    }

                    this.noteEvents.forEach((note) => {
                        Tone.getTransport().schedule((time) => {
                            this.synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
                        }, note.time);
                    });

                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                    }
                    drawFrame(this.view);

                } catch (error) {
                    console.error("Error playing MIDI:", error);
                    alert("Error playing MIDI. Please ensure the MIDI data is correct.");
                }
            } else {
                alert('Please select a MIDI file.');
            }
        });

        document.addEventListener(PAUSE, () => {
            Tone.getTransport().pause();
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        });
    }
}