export const spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
};

export const sizing = {
  minTouchTarget: 60,
  cardSize:       130,
  iconSize:       48,
  borderRadius: {
    xs:   6,
    sm:   12,
    md:   20,
    lg:   28,
    xl:   36,
    full: 9999,
  },
};

/** Pre-built shadow styles for consistent depth */
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#6478B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#5060A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3D4F90',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  xl: {
    shadowColor: '#2B3A78',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 12,
  },
  /** Bottom-only shadow for 3D button effect */
  button3d: {
    shadowColor: '#B83C10',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },
};
