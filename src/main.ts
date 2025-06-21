const canvas = document.querySelector("canvas") as HTMLCanvasElement;

if (!navigator.gpu) {
  throw new Error("WebGPU not supported on this browser.");
}

const adapter = await navigator.gpu?.requestAdapter();
if (!adapter) {
  throw new Error("No appropriate GPUAdapter found.");
}
const device = await adapter.requestDevice();

const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device: device,
  format: canvasFormat,
});

const vertices = new Float32Array([
  //   X,    Y,
  -0.8, -0.8, // Triangle 1 (Blue)
  0.8, -0.8,
  0.8, 0.8,

  -0.8, -0.8, // Triangle 2 (Red)
  0.8, 0.8,
  -0.8, 0.8,
]);

const vertexBuffer = device.createBuffer({
  label: "Cell vertices",
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

const vertexBufferLayout = {
  arrayStride: 8,
  attributes: [{
    format: "float32x2",
    offset: 0,
    shaderLocation: 0, // Position, see vertex shader
  }],
};
const cellShaderModule = device.createShaderModule({
  label: "Cell shader",
  code: `
    @vertex
    fn vertexMain(@location(0) pos: vec2<f32>) -> 
    @builtin(position) vec4<f32> {
      return vec4f(pos, 0, 1); // (x, y, z, w)
    }

    @fragment
    fn fragmentMain() -> @location(0) vec4<f32> {
      return vec4f(1, 0, 0, 1); // (r, g, b, a)
    }
  `
});

const cellPipeline = device.createRenderPipeline({
  label: "Cell pipeline",
  layout: "auto",
  vertex: {
    module: cellShaderModule,
    entryPoint: "vertexMain",
    buffers: [vertexBufferLayout]
  },
  fragment: {
    module: cellShaderModule,
    entryPoint: "fragmentMain",
    targets: [{
      format: canvasFormat
    }]
  }
});



const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    loadOp: "clear",
    clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
    storeOp: "store",
  }]
});
pass.setPipeline(cellPipeline);
pass.setVertexBuffer(0, vertexBuffer);
pass.draw(vertices.length / 2);
pass.end();

const commandBuffer = encoder.finish();
device.queue.submit([commandBuffer]);
device.queue.submit([encoder.finish()]);