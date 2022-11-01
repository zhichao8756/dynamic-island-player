import { Howl, Howler } from 'howler'
import { storeToRefs } from 'pinia'
import pinia from '@/store/store'
import { usePlayerStore } from '@/store/playerState.js'
const store = usePlayerStore(pinia)
const { title, author, cover } = storeToRefs(store)

class Player {
  constructor (playlist, timeElement, progressElement, durationElement, html5) {
    this.playlist = playlist
    this.timeElement = timeElement
    this.progressElement = progressElement
    this.durationElement = durationElement
    this.html5 = html5
    this.index = 0
  }

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play = (index) => {
    const self = this
    return new Promise((resolve, reject) => {
      let sound
      let totalTime = ''
      index = typeof index === 'number' ? index : self.index
      const data = self.playlist[index]
      // If we already loaded this track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl
      } else {
        sound = data.howl = new Howl({
          src: data.file,
          html5: this.html5,
          onplay: () => {
            totalTime = this.formatTime(Math.round(sound.duration()))
            this.durationElement.innerHTML = totalTime
            // Start updating the progress of the track.
            requestAnimationFrame(this.step)
            const songInfo = {
              title: data.title,
              soundState: sound.state(),
              author: data.author,
              cover: data.cover
            }
            store.title = data.title
            store.author = data.author
            store.cover = data.cover
            store.soundState = 'playing'
            resolve(songInfo)
            // Start the wave animation if we have already loaded
            // pauseBtn.style.display = 'block'
          },
          onload: function () {
            // Start the wave animation.
            // loading.style.display = 'none'
          },
          onend: function () {
            // Stop the wave animation.
            self.skip('next')
          },
          onpause: function () {
            store.soundState = 'pause'
            // Stop the wave animation.
            // wave.container.style.display = 'none'
          },
          onstop: function () {
            // Stop the wave animation.
            // wave.container.style.display = 'none'
          },
          onseek: function () {
            // Start updating the progress of the track.
            requestAnimationFrame(self.step)
          }
        })
      }
      // Begin playing the sound.
      sound.play()
      self.index = index
    })
  }

  step = () => {
    // Get the Howl we want to manipulate.
    const sound = this.playlist[this.index].howl

    // Determine our current seek position.
    const seek = sound.seek() || 0
    this.timeElement.innerHTML = this.formatTime(Math.round(seek))
    this.progressElement.style.width = (((seek / sound.duration()) * 100) || 0) + '%'
    if (sound.playing()) {
      requestAnimationFrame(this.step)
    }
  }

  /**
   * Pause the currently playing track.
   */
  pause = () => {
    const self = this
    const sound = self.playlist[self.index].howl
    sound.pause()
  }

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip = (direction) => {
    return new Promise((resolve, reject) => {
      let index = 0
      if (direction === 'prev') {
        index = this.index - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
      } else {
        index = this.index + 1
        if (index >= this.playlist.length) {
          index = 0
        }
      }
      this.skipTo(index)
      resolve(this.playlist[index])
    })
  }

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo = (index) => {
    const self = this
    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop()
    }
    this.progressElement.style.width = '0%'
    // Reset progress.
    // progress.style.width = '0%'

    // Play the new track.
    this.play(index)
  }

  /**
   * Set sound volume.
   * @param  {Number} val optional Volume from 0.0 to 1.0.
   */
  volume = (val) => {
    // Update the global volume (affecting all Howls).
    Howler.volume(val)
  }

  /**
   * Set sound muted.
   * @param  {Boolean} val True to mute and false to unmute.
   */
  mute = (val) => {
    Howler.mute(val)
  }

  /**
   * Set sound rate.
   * @param  {Number} val The rate of playback. 0.5 to 4.0, with 1.0 being normal speed.
   */
  rate = (val) => {
    const sound = this.playlist[this.index].howl
    if (sound) {
      sound.rate(val)
    }
  }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek = (per) => {
    const self = this

    // Get the Howl we want to manipulate.
    const sound = self.playlist[self.index].howl

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per)
    }
  }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} val seconds through the song to skip.
   */
  seekBySeconds = (val) => {
    const sound = this.playlist[this.index].howl
    if (sound.playing()) {
      this.progressElement.style.width = (sound.duration() / val * 100) + '%'
      sound.seek(val)
    }
  }

  getSoundState = (state) => {
    return state
  }

  getTrack = (title) => {
    return title
  }

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime = (secs) => {
    const minutes = Math.floor(secs / 60) || 0
    const seconds = (secs - minutes * 60) || 0

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }
}

export default Player
