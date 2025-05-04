import { View } from "./view.js"
import { initComponents } from "./view/components.js";
import * as Tone from "tone";
import { Midi } from '@tonejs/midi';

/* CUSTOM TYPES */

/* CUSTOM CLASS */

/**
 * A class for managing the connection between model and view. This class serves as the adapter in MVA.
 *
 * @class Controller
 * @typedef {Controller}
 */
export class Controller {
  view;

    constructor() {
        this.view = new View();
    }

    /**
     * Initializes the Controller - sets up components, error displays, and event listeners.
     *
     * @public
     */
    initialize() {
        initComponents();

        const playButton = document.getElementById('play-button');
        const midiFileInput = document.getElementById('midi-file-input');
        let midi = null;
        let synth = null;

        midiFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        midi = new Midi(e.target.result); // Use Tone.Midi directly
                        const json = JSON.stringify(midi, null, 2);
                        console.log("Midi data loaded!", json);
                    } catch (error) {
                        console.error("Error parsing MIDI:", error);
                        alert("Error parsing MIDI file. Please ensure it is a valid MIDI file.");
                    }
                };
                reader.readAsArrayBuffer(file); // Important: read as ArrayBuffer!
            }
        });

        const secondsToTraverse = 5;

        playButton.addEventListener('click', async () => {
            if (midi) {
                if (!synth) {
                    synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Use a PolySynth
                }

                Tone.getTransport().cancel();
                Tone.getTransport().stop();

                try {
                    Tone.getTransport().bpm.value = midi.header.tempos[0].bpm;
                    midi.tracks.forEach(track => {
                        track.notes.forEach(note => {
                            console.log("midi note fields", [note.name, note.duration, note.time, note.velocity]);
                            Tone.getTransport().schedule((time) => {
                                synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
                            }, note.time + secondsToTraverse-0.3); // TODO: Figure out this 0.3

                            Tone.getDraw().schedule(() => {
                                this.view.createNote(note.time, note);
                            }, note.time);
                        });
                    });

                    Tone.getTransport().start();

                } catch (error) {
                    console.error("Error playing MIDI:", error);
                    alert("Error playing MIDI. Please ensure the MIDI data is correct.");
                }
            } else {
                alert('Please select a MIDI file.');
            }
        });
    }
}
