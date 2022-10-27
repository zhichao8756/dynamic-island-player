# vue-dynamic-island-player

## Description
a vue-audio-player based on Howler.js,The animation of the player is interacted with reference to IOS dynamic island.

Additional information, live demos and a user showcase are available at [https://zhichao8756.github.io/player-demo/](https://zhichao8756.github.io/player-demo/).

welcome to create issue, help improve the player :)

### Features
* A set of Vue components out of the box.
* Single API for all audio needs
* Defaults to Web Audio API and falls back to HTML5 Audio
* Supports all codecs for full cross-browser support
* Full control for fading, rate, seek, volume, etc.
* No outside dependencies, just pure JavaScript

### Browser Compatibility
Tested in the following browsers/versions:
* Google Chrome 7.0+
* Internet Explorer 9.0+
* Firefox 4.0+
* Safari 5.1.4+
* Mobile Safari 6.0+ (after user input)
* Opera 12.0+
* Microsoft Edge

### Live Demo
* [Demo](https://zhichao8756.github.io/player-demo/)

## Install

```bash
$ npm i vue-dynamic-island-player
```
## Quick Start
```javascript
<script setup>
import { DynamicIslandPlayer } from 'vue-dynamic-island-player'
import "../node_modules/vue-dynamic-island-player/style.css"; //引入组件样式
import { ref } from 'vue'

const playList = ref([
{
    // song of title
    title: 'Rave Digger',
    // sound file
    file: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
    // howler instance
    howl: null,
    // song of author
    author: 'Cherrystones',
    // song of cover
    cover: cover1
}
])
</script>

<template>
    <div>
        <DynamicIslandPlayer/>
    </div>
</template>


```
## API Docs
### Props Attributes
| Attribute | Description                      | type    | Accepted Values | default|
|-----------|----------------------------------|---------|-----------------|--------|
| playList  | songs of list                    | Array   | -               | -      |
| volume    | sound volume                     | Number  | `0.0` ~ `1.0`   | `0.5 ` |
| html5     | set to true to force HTML5 Audio | Boolean | `true`/ `false` | `true `|

### Methods
| Methods         | Description                                          | Parameters                                            |
|-----------------|------------------------------------------------------|-------------------------------------------------------|
| getSoundState() | return the current sound state (`playing` / `pause`) | -                                                     |
| setVolume()     | set sound volume, range `0.0` to `1.0 `              | `function(0.8)`                                       |
| setMute()       | Mutes the sound, but doesn't pause the playback      | `function(Boolean)` True to mute and false to unmute. |
| seekBySeconds() | Get/set the position of playback for a sound         | `function(Number)` skip to a second of sound.         |
| toggle()        | toggle the sound play or /pause                      | -                                                     |
| playNext()      | skip to next song                                    | -                                                     |
| playPrevious()  | back to previous song                                | -                                                     |

### Events
| Event Name	 | Description                   | Parameters |
|-------------|-------------------------------|------------|
| play        | triggers when click play      | -          |
| pause       | triggers when click pause     | -          |
| next        | triggers when click next      | -          |
| previous    | triggers when click previous  | -          |

## License

vue-dynamic-island-player is open source software licensed as MIT.
