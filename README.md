# threejs-webxr-shader-examples

I'm reading the book "Practical Shader Development: Vertex and Fragment Shaders for Game Developers" (Kyle Halladay, April 2019).
From the start, I have tried to implement the examples in WebXR using three.js with WebGL version 2.
A nice challenge, since all examples in the book have been implemented in [openFrameworks](https://openframeworks.cc/).

In the book, GLSL version 410 is used. WebGL version 2 is using GLSL ES version 300
(See: [GLSL versions][GLSL-Versions])

The original examples from the book can be found [here][Book examples].

### More reading
Another interesting read: [The Book of Shaders][book-of-shaders]

### Credits:
For teleporting, [xr-locomotion-starter][xr-locomotion-starter] is used.

### Build steps:

```
# install dependencies
npm install

# compile everything
npm run build

# develop mode
npm run develop

#start a local server
npm run start
```

[xr-locomotion-starter]: https://github.com/SamsungInternet/xr-locomotion-starter
[book-of-shaders]: https://thebookofshaders.com/
[GLSL-Versions]: https://github.com/mattdesl/lwjgl-basics/wiki/GLSL-Versions
[Book examples]: https://github.com/Apress/practical-shader-dev

