'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FLOW = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uAspect;
void main() {
  vec2 flow = texture2D(uPrev, vUv).xy * 2.0 - 1.0;
  flow *= 0.965;
  vec2 d = vUv - uMouse;
  d.x *= uAspect;
  float infl = smoothstep(0.34, 0.0, length(d));
  flow += uVel * infl * 0.85;
  flow = clamp(flow, vec2(-1.0), vec2(1.0));
  gl_FragColor = vec4(flow * 0.5 + 0.5, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform sampler2D uFlow;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 flow = texture2D(uFlow, vUv).xy * 2.0 - 1.0;
  p += flow * 0.42;

  float t = uTime * 0.12;
  vec2 q = vec2(
    fbm(p * 0.85 + vec2(0.0, t)),
    fbm(p * 0.85 + vec2(5.2, -t))
  );
  vec2 r = vec2(
    fbm(p + q * 1.35 + vec2(1.7, t * 0.4)),
    fbm(p + q.yx * 1.35 + vec2(-t * 0.3, 2.8))
  );
  float field = fbm(p * 0.9 + r * 1.15);

  float ribbon = smoothstep(0.18, 0.72, field);
  ribbon *= smoothstep(1.15, 0.05, length((p - vec2(-0.25 + sin(t) * 0.12, 0.02)) * vec2(0.75, 1.15)));
  vec3 warm = mix(vec3(0.07, 0.015, 0.02), vec3(0.93, 0.34, 0.05), ribbon);
  warm = mix(warm, vec3(0.45, 0.07, 0.015), smoothstep(0.48, 0.9, field));

  float coolN = fbm(p * 1.05 + vec2(-t * 0.6, 3.0) + r);
  vec3 cool = mix(vec3(0.03, 0.0, 0.07), vec3(0.42, 0.12, 0.62), smoothstep(0.32, 0.82, coolN));
  cool += vec3(0.0, 0.05, 0.08) * smoothstep(0.6, 1.0, coolN);

  vec3 col = 1.0 - (1.0 - warm) * (1.0 - cool);

  float grain = hash(gl_FragCoord.xy + floor(uTime * 24.0));
  col += (grain - 0.5) * 0.045;

  vec2 vg = vUv * (1.0 - vUv.yx);
  float vig = pow(clamp(vg.x * vg.y * 15.0, 0.0, 1.0), 0.42);
  float yfade = pow(clamp(vUv.y * (1.0 - vUv.y) * 4.2, 0.0, 1.0), 0.55);
  col *= vig * (0.35 + 0.65 * yfade);

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function program(gl: WebGLRenderingContext, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  return prog
}

export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false })
    if (!gl) return

    const drawProg = program(gl, FRAG)
    const flowProg = program(gl, FLOW)
    if (!drawProg || !flowProg) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    const size = 256
    const makeTarget = () => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      return { tex, fbo }
    }
    const targets = [makeTarget(), makeTarget()]
    let ping = 0

    const neutral = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, neutral)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 0, 255]))

    const mouse = { x: 0.5, y: 0.5 }
    const vel = { x: 0, y: 0 }
    const smooth = { x: 0, y: 0 }
    let last = performance.now()
    let lastMove = last
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const now = performance.now()
      const dt = Math.max(16, now - lastMove)
      lastMove = now
      const x = (e.clientX - rect.left) / rect.width
      const y = 1 - (e.clientY - rect.top) / rect.height
      vel.x = (x - mouse.x) / (dt * 0.001)
      vel.y = (y - mouse.y) / (dt * 0.001)
      const mag = Math.hypot(vel.x, vel.y)
      if (mag > 1.4) {
        vel.x = vel.x / mag * 1.4
        vel.y = vel.y / mag * 1.4
      }
      mouse.x = x
      mouse.y = y
    }
    const host = canvas.parentElement || canvas
    if (!coarse) host.addEventListener('mousemove', onMove)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, canvas.clientWidth)
      const h = Math.max(1, canvas.clientHeight)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let clock = 0
    let raf = 0
    let alive = true
    const uTime = gl.getUniformLocation(drawProg, 'uTime')
    const uRes = gl.getUniformLocation(drawProg, 'uRes')
    const uFlow = gl.getUniformLocation(drawProg, 'uFlow')
    const drawPos = gl.getAttribLocation(drawProg, 'aPos')
    const flowPos = gl.getAttribLocation(flowProg, 'aPos')
    const uPrev = gl.getUniformLocation(flowProg, 'uPrev')
    const uMouse = gl.getUniformLocation(flowProg, 'uMouse')
    const uVel = gl.getUniformLocation(flowProg, 'uVel')
    const uAspect = gl.getUniformLocation(flowProg, 'uAspect')

    const frame = (now: number) => {
      if (!alive) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!reduce) clock += dt
      smooth.x += (vel.x - smooth.x) * 0.08
      smooth.y += (vel.y - smooth.y) * 0.08
      vel.x *= 0.9
      vel.y *= 0.9

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      if (!coarse) {
        const src = targets[ping]
        const dst = targets[1 - ping]
        ping = 1 - ping
        gl.useProgram(flowProg)
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo)
        gl.viewport(0, 0, size, size)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, src.tex)
        gl.uniform1i(uPrev, 0)
        gl.uniform2f(uMouse, mouse.x, mouse.y)
        gl.uniform2f(uVel, smooth.x, smooth.y)
        gl.uniform1f(uAspect, canvas.width / Math.max(canvas.height, 1))
        gl.enableVertexAttribArray(flowPos)
        gl.vertexAttribPointer(flowPos, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(drawProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, coarse ? neutral : targets[ping].tex)
      gl.uniform1i(uFlow, 0)
      gl.uniform1f(uTime, clock)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.enableVertexAttribArray(drawPos)
      gl.vertexAttribPointer(drawPos, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!reduce) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      host.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={ref} aria-hidden />
}
