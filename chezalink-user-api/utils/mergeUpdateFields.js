// utils/mergeUpdateFields.js

function mergeUpdateFields(existing, updates) {
  const merged = {};
  for (const key in existing) {
    // If the update has a value (not undefined), use it; otherwise, keep the existing one
    merged[key] = updates[key] !== undefined ? updates[key] : existing[key];
  }
  return merged;
}

module.exports = { mergeUpdateFields };
