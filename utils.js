// utils.js

export function drawObject(gl, program, x, y, size, color) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y,
        x + size, y,
        x, y + size,
        x + size, y,
        x, y + size,
        x + size, y + size,
    ]), gl.STATIC_DRAW);

    gl.uniform4fv(gl.getUniformLocation(program, "u_color"), color);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}