import { Controller } from "./controller.js";
import * as Tone from "tone";
import { Midi } from '@tonejs/midi';

/**
 * Initial entry to point of the application.
 *
 * Initializes the components, handles authentication, and sets up the event
 * listeners for workspace and channel interactions.
 */
async function main() {
    console.log("In Main");
    const controller = new Controller();
    controller.initialize();
}

/* Register event handler to run after the page is fully loaded. */
document.addEventListener("DOMContentLoaded", () => {
    main().catch((error) => {
        console.log("Error caught in main.ts:", ["Error: ", error]);
    });

    console.log("Hello World from Main!");

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

    playButton.addEventListener('click', async () => {
        if (midi) {
            if (!synth) {
                synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Use a PolySynth
            }

            Tone.getTransport().cancel();
            Tone.getTransport().stop();

            console.log(midi);

            try {
                Tone.getTransport().bpm.value = midi.header.tempos[0].bpm;
                midi.tracks.forEach(track => {
                    track.notes.forEach(note => {
                        console.log("midi note fields", [note.name, note.duration, note.time, note.velocity]);
                        Tone.getTransport().schedule(time => {
                            synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
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
});