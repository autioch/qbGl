const PNAMES = [
  'ACTIVE_TEXTURE',
  'ALIASED_LINE_WIDTH_RANGE',
  'ALIASED_POINT_SIZE_RANGE',
  'ALPHA_BITS',
  'ARRAY_BUFFER_BINDING',
  'BLEND',
  'BLEND_COLOR',
  'BLEND_DST_ALPHA',
  'BLEND_DST_RGB',
  'BLEND_EQUATION',
  'BLEND_EQUATION_ALPHA',
  'BLEND_EQUATION_RGB',
  'BLEND_SRC_ALPHA',
  'BLEND_SRC_RGB',
  'BLUE_BITS',
  'COLOR_CLEAR_VALUE',
  'COLOR_WRITEMASK',
  'COMPRESSED_TEXTURE_FORMATS',
  'CULL_FACE',
  'CULL_FACE_MODE',
  'CURRENT_PROGRAM',
  'DEPTH_BITS',
  'DEPTH_CLEAR_VALUE',
  'DEPTH_FUNC',
  'DEPTH_RANGE',
  'DEPTH_TEST',
  'DEPTH_WRITEMASK',
  'DITHER',
  'ELEMENT_ARRAY_BUFFER_BINDING',
  'FRAMEBUFFER_BINDING',
  'FRONT_FACE',
  'GENERATE_MIPMAP_HINT',
  'GREEN_BITS',
  'IMPLEMENTATION_COLOR_READ_FORMAT',
  'IMPLEMENTATION_COLOR_READ_TYPE',
  'LINE_WIDTH',
  'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
  'MAX_CUBE_MAP_TEXTURE_SIZE',
  'MAX_FRAGMENT_UNIFORM_VECTORS',
  'MAX_RENDERBUFFER_SIZE',
  'MAX_TEXTURE_IMAGE_UNITS',
  'MAX_TEXTURE_SIZE',
  'MAX_VARYING_VECTORS',
  'MAX_VERTEX_ATTRIBS',
  'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
  'MAX_VERTEX_UNIFORM_VECTORS',
  'MAX_VIEWPORT_DIMS',
  'PACK_ALIGNMENT',
  'POLYGON_OFFSET_FACTOR',
  'POLYGON_OFFSET_FILL',
  'POLYGON_OFFSET_UNITS',
  'RED_BITS',
  'RENDERBUFFER_BINDING',
  'RENDERER',
  'SAMPLE_BUFFERS',
  'SAMPLE_COVERAGE_INVERT',
  'SAMPLE_COVERAGE_VALUE',
  'SAMPLES',
  'SCISSOR_BOX',
  'SCISSOR_TEST',
  'SHADING_LANGUAGE_VERSION',
  'STENCIL_BACK_FAIL',
  'STENCIL_BACK_FUNC',
  'STENCIL_BACK_PASS_DEPTH_FAIL',
  'STENCIL_BACK_PASS_DEPTH_PASS',
  'STENCIL_BACK_REF',
  'STENCIL_BACK_VALUE_MASK',
  'STENCIL_BACK_WRITEMASK',
  'STENCIL_BITS',
  'STENCIL_CLEAR_VALUE',
  'STENCIL_FAIL',
  'STENCIL_FUNC',
  'STENCIL_PASS_DEPTH_FAIL',
  'STENCIL_PASS_DEPTH_PASS',
  'STENCIL_REF',
  'STENCIL_TEST',
  'STENCIL_VALUE_MASK',
  'STENCIL_WRITEMASK',
  'SUBPIXEL_BITS',
  'TEXTURE_BINDING_2D',
  'TEXTURE_BINDING_CUBE_MAP',
  'UNPACK_ALIGNMENT',
  'UNPACK_COLORSPACE_CONVERSION_WEBGL',
  'UNPACK_FLIP_Y_WEBGL',
  'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
  'VENDOR',
  'VERSION',
  'VIEWPORT'
];

export default function parameters(context) {
  return PNAMES.map((pname) => {
    const glPname = context[pname];

    return [pname, context.getParameter(glPname)];
  });
}
