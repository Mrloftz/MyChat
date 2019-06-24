import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  ɵConsole
} from '@angular/core';
declare var $: any;
// declare var require: any;
declare var JitsiMeetJS: any;
let connection: any;
let room: any;
let localTracks = [];
// let isVideo = true;
let isJoined = false;
const remoteTracks = {};
// const JitsiMeetJS = require('lib-jitsi-meet');

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.component.html',
  styleUrls: ['./tab5.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab5Component implements AfterViewInit, OnInit {
  @ViewChild('video') video: ElementRef;
  options = {
    hosts: {
      domain: 'meet.jitsi',
      muc: 'muc.meet.jitsi' // FIXME: use XEP-0030
    },
    bosh: 'http://meet.jitsi:8000/http-bind',
    clientNode: 'http://jitsi.org/jitsimeet'
  };
  constructor(public renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.videoConference();
  }

  async videoConference() {
    try {
      connection = new JitsiMeetJS.JitsiConnection(null, null, this.options);
      await JitsiMeetJS.init();
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        () => {
          return onConnectionSuccess(this.renderer);
        }
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed
      );
      connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        disconnect
      );
      JitsiMeetJS.mediaDevices.addEventListener(
        JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
        onDeviceListChanged
      );
      connection.connect();

      JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
        .then(x => onlocalTracks(x, this.renderer))
        .catch(error => {
          throw error;
        });
      if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
        JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
          const audioOutputDevices = devices.filter(
            d => d.kind === 'audiooutput'
          );

          if (audioOutputDevices.length > 1) {
            $('#audioOutputSelect').html(
              audioOutputDevices
                .map(d => `<option value="${d.deviceId}">${d.label}</option>`)
                .join('\n')
            );

            $('#audioOutputSelectWrapper').show();
          }
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  unload() {
    try {
      for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].dispose();
      }
      // room.leave();
      connection.disconnect();
    } catch (error) {
      console.log('error', error);
    }
  }
}

function onlocalTracks(tracks, renderer) {
  localTracks = tracks;
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      audioLevel => {}
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      () => console.log('local track muted')
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
      () => console.log('local track stoped')
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      deviceId =>
        console.log(`track audio output device was changed to ${deviceId}`)
    );
    const wrapper = $('<div/>', { class: 'videoWrapper' });
    if (localTracks[i].getType() === 'video') {
      $('#video').append(wrapper);
      wrapper
        .append(
          $('<video/>', {
            autoplay: '1',
            id: 'localVideo' + i,
            width: '100%',
            height: 'auto'
          })
        )
        .append(
          $('<span/>', {
            class: 'unmutebutton0'
          })
        );
      localTracks[i].attach($('#localVideo' + i)[0]);
    } else {
      $('#video').append(`<audio autoplay='1' id='localAudio${i}' />`);
      localTracks[i].attach($('#localAudio' + i)[0]);
    }
    if (isJoined) {
      room.addTrack(localTracks[i]);
    }
    $('.unmutebutton0').click(function() {
      console.log('55555555555555555', localTracks[0]);
      if (localTracks[0].getType() === 'audio') {
        if (localTracks[0].track.enabled === true) {
          localTracks[0].mute();
          $('.unmutebutton0')
            .removeClass('unmutebutton0')
            .addClass('mutebutton0');
        } else {
          localTracks[0].unmute();
          $('.mutebutton0')
            .removeClass('mutebutton0')
            .addClass('unmutebutton0');
        }
      }
    });
  }
}

function onConnectionSuccess(renderer) {
  const confOptions = {
    openBridgeChannel: true
  };
  room = connection.initJitsiConference('conference', confOptions);
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, track => {
    return onRemoteTrack(track, renderer);
  });
  room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
    console.log(`track removed!!!${track}`);
  });
  room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
  room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
    console.log('user join', remoteTracks);
    remoteTracks[id] = [];
  });
  room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
  room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
    console.log(`${track.getType()} - ${track.isMuted()}`);
  });
  room.on(
    JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
    (userID, displayName) => console.log(`${userID} - ${displayName}`)
  );
  room.on(
    JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
    (userID, audioLevel) => {}
  );
  room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () =>
    console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`)
  );
  room.join();
}

function onConnectionFailed() {
  console.error('Connection Failed!');
}

function disconnect() {
  console.log('disconnect!', connection);
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess
  );
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed
  );
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    disconnect
  );
}

function onDeviceListChanged(devices) {
  console.log('current devices', devices);
}

function onUserLeft(id) {
  console.log('user left', remoteTracks[id]);
  if (!remoteTracks[id]) {
    return;
  }
  const tracks = remoteTracks[id];

  for (let i = 0; i < tracks.length; i++) {
    tracks[i].detach($(`#${id}${tracks[i].getType()}`));
  }
}

function onRemoteTrack(track, renderer) {
  if (track.isLocal()) {
    return;
  }
  const participant = track.getParticipantId();
  if (!remoteTracks[participant]) {
    remoteTracks[participant] = [];
  }
  const idx = remoteTracks[participant].push(track);

  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
    audioLevel => {}
  );
  track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () =>
    console.log('remote track muted')
  );
  track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
    console.log('remote track stoped')
  );
  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
    deviceId =>
      console.log(`track audio output device was changed to ${deviceId}`)
  );
  const id = participant + track.getType();
  const wrapper = $('<div/>', { class: 'videoWrapper' });
  if (track.getType() === 'video') {
    // $('#video').append(`<video autoplay='1' id='${participant}video${idx}' />`);
    $('#video').append(wrapper);
    wrapper
      .append(
        $('<video/>', {
          autoplay: '1',
          id: participant + 'video',
          width: '100%',
          height: 'auto'
        })
      )
      .append(
        $('<span/>', {
          class: participant + ' unmutebutton'
        })
      );
  } else {
    $('#video').append(
      // `<audio autoplay='1'  id='${participant}audio${idx}' />`
      `<audio autoplay='1'  id='${participant}audio' />`
    );
  }
  track.attach($(`#${id}`)[0]);
  $('.unmutebutton').click(function() {
    const audioTrack = remoteTracks[this.className.split(' ')[0]][0];
    if (audioTrack.track.enabled === true) {
      audioTrack.track.enabled = false;
      $(this)
        .removeClass('unmutebutton')
        .addClass('mutebutton');
    } else {
      audioTrack.track.enabled = true;
      $(this)
        .removeClass('mutebutton')
        .addClass('unmutebutton');
    }
  });
}
function onConferenceJoined() {
  console.log('conference joined!');
  isJoined = true;
  for (let i = 0; i < localTracks.length; i++) {
    room.addTrack(localTracks[i]);
  }
}

// changeAudioOutput(selected) {
//   JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
// }

// switchVideo() {
//   isVideo = !isVideo;
//   if (localTracks[1]) {
//     localTracks[1].dispose();
//     localTracks.pop();
//   }
//   JitsiMeetJS.createLocalTracks({
//     devices: [isVideo ? 'video' : 'desktop']
//   })
//     .then(tracks => {
//       localTracks.push(tracks[0]);
//       localTracks[1].addEventListener(
//         JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
//         () => console.log('local track muted')
//       );
//       localTracks[1].addEventListener(
//         JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
//         () => console.log('local track stoped')
//       );
//       localTracks[1].attach($('#localVideo1')[0]);
//       room.addTrack(localTracks[1]);
//     })
//     .catch(error => console.log(error));
// }
