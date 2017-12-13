/**
 * given crosswalk, aaId, and admin level, returns its id
 * @param {object} crosswalk object to translate between admin boundaries and vpromms ids
 * @param {number} aaId current admin id
 * @return admin id
 */
export function getAdminId (crosswalk, idFinder, level) {
  if (level === 'province') {
    return crosswalk[level][idFinder.aaId].id;
  } else {
    return crosswalk[level][idFinder.aaIdSub];
  }
}

/**
 * given crosswalk, aaid, level, and adminInfo object, returns admin name
 * @param {object} crosswalk object to translate between admin boundaries and vpromms ids
 * @param {number} aaId current admin id
 * @param {string} level admin level, district or province
 * @return admin name
 */
export function getAdminName (crosswalk, idFinder, level, adminInfo) {
  if (level === 'province') {
    return crosswalk[level][idFinder.aaId].name;
  } else {
    return adminInfo.children.find(child => child.id === Number(idFinder.aaIdSub)).name_en;
  }
}
