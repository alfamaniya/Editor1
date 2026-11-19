test("Visual preview picker shows a non-interactive hovered element identity tooltip", () => {
  assert.match(visual, /editor1-visual-identity-tip/);
  assert.match(visual, /function identityFor\(el\)/);
  assert.match(visual, /el\.id\?\("\#\+el\.id\)/);
  assert.match(visual, /\.classList\]/);
  assert.match(visual, /pointer-events:none/);
  assert.match(visual, /function moveIdentity\(e\)/);
  assert.match(visual, /Math\.max\(pad,Math\.min/);
  assert.match(visual, /function hideIdentity\(\)/);
  assert.match(visual, /hideIdentity\(\)/);
});
test("Visual preview picker shows a non-interactive hovered element identity tooltip", () => {
  assert.ok(visual.includes("editor1-visual-identity-tip"));
  assert.ok(visual.includes('el.id?("#"+el.id)'));
  assert.ok(visual.includes("el.classList"));
  assert.ok(visual.includes("pointer-events:none"));
  assert.ok(visual.includes("function moveIdentity(e)"));
  assert.ok(visual.includes("Math.max(pad,Math.min"));
  assert.ok(visual.includes("function hideIdentity()"));
  assert.ok(visual.includes("hideIdentity()"));
});
