import { BigInt } from "@graphprotocol/graph-ts";

// GyroECLP pools store two parameter sets: the primary params (alpha, beta, c, s, lambda, 18 decimals)
// and the derived params (tauAlpha, tauBeta, u, v, w, z, dSq, 38 decimals, "Xp"). The pool constructor
// validates only bounds on the derived values - GyroECLPMath.validateDerivedParamsLimits carries an
// explicit "does NOT check for internal consistency" disclaimer - so a pool can be deployed whose
// derived params do not correspond to its primary params, which leaks value on ordinary swaps. Three
// live mainnet pools were found storing z with the correct magnitude and the wrong sign.
//
// u, v, w, z and dSq are fixed by c, s and the two tau vectors through plain algebra, with no
// transcendental function and no normalization factor anywhere in it:
//
//   u   = c*s * (tauBeta.x - tauAlpha.x)
//   v   = s*s * tauBeta.y + c*c * tauAlpha.y
//   w   = c*s * (tauBeta.y - tauAlpha.y)
//   z   = c*c * tauBeta.x + s*s * tauAlpha.x
//   dSq = c*c + s*s
//
// This is not a reimplementation of the ECLP math the pools price with; it is the definition of the
// derived values, evaluated on the pool's own stored inputs. Ported from gyro_check.py (expected_derived
// and check_derived), which validates the same identity against every honest pool in the deployed set.

// 1e18 * 1e18. Divides an (18-dec * 18-dec * Xp) product back to Xp.
const E36 = BigInt.fromString("1000000000000000000000000000000000000");

// 1e38, one unit in Xp precision.
const ONE_XP = BigInt.fromString("100000000000000000000000000000000000000");

// Largest per-value gap tolerated, in Xp units. This is not slack for precision: honest pools sit at 0
// to 1 wei, but a handful were built by a generator that divides the five values by dSq. Since dSq is
// c*c + s*s, which differs from 1 only by the 18-decimal rounding of the rotation components, the two
// conventions agree to about 1.1e-18 relative, or about 1.1e20 in Xp units. 1e24 clears that spread by
// four orders of magnitude and still sits about seventeen orders below a real inconsistency.
const DERIVED_TOL_XP = BigInt.fromString("1000000000000000000000000");

// 1e18.
const E18 = BigInt.fromString("1000000000000000000");

// Relative tolerances, expressed as their inverse: a and b agree when
// |a - b| <= max(|a|, |b|) / TOL_INV. Calibrated against all 2008 live v3 GyroECLP pools.
//
// The tau identity below holds to 1.2e-20 on the worst honest pool, so 1e-14 clears it by about six
// orders of magnitude while sitting roughly fourteen orders below a real mismatch.
const TAU_TOL_INV = BigInt.fromString("100000000000000");

// The tau vectors are normalized only to the 18-decimal rounding of c and s, so honest pools sit as far
// out as 1.3e-18. 1e-12 clears that by about six orders too. This check is a backstop: it is the only
// thing that catches both tau components being scaled by a common factor, which the ratio identity is
// blind to by construction.
const NORM_TOL_INV = BigInt.fromString("1000000000000");

// 1e76, the square of one unit in Xp precision.
const ONE_XP_SQ = ONE_XP.times(ONE_XP);

const ZERO = BigInt.fromI32(0);

/**
 * The raw, unscaled ECLP parameters as returned by the pool. Both getGyroECLPPoolImmutableData() and
 * getECLPParams() expose the same values under different shapes, so the check reads either one.
 */
export class EclpRawParams {
  alpha: BigInt;
  beta: BigInt;
  c: BigInt;
  s: BigInt;
  lambda: BigInt;
  tauAlphaX: BigInt;
  tauAlphaY: BigInt;
  tauBetaX: BigInt;
  tauBetaY: BigInt;
  u: BigInt;
  v: BigInt;
  w: BigInt;
  z: BigInt;
  dSq: BigInt;

  constructor(
    alpha: BigInt,
    beta: BigInt,
    c: BigInt,
    s: BigInt,
    lambda: BigInt,
    tauAlphaX: BigInt,
    tauAlphaY: BigInt,
    tauBetaX: BigInt,
    tauBetaY: BigInt,
    u: BigInt,
    v: BigInt,
    w: BigInt,
    z: BigInt,
    dSq: BigInt
  ) {
    this.alpha = alpha;
    this.beta = beta;
    this.c = c;
    this.s = s;
    this.lambda = lambda;
    this.tauAlphaX = tauAlphaX;
    this.tauAlphaY = tauAlphaY;
    this.tauBetaX = tauBetaX;
    this.tauBetaY = tauBetaY;
    this.u = u;
    this.v = v;
    this.w = w;
    this.z = z;
    this.dSq = dSq;
  }
}

/**
 * Divides an (18-dec * 18-dec * Xp) product back to Xp, truncating toward zero as the generators do.
 * BigInt.div already truncates toward zero; the sign is handled explicitly so that does not have to be
 * taken on trust.
 */
function toXp(n: BigInt): BigInt {
  let q = n.abs().div(E36);
  return n.lt(ZERO) ? q.neg() : q;
}

function matches(stored: BigInt, expected: BigInt): boolean {
  return stored.minus(expected).abs().le(DERIVED_TOL_XP);
}

/**
 * True when u, v, w, z and dSq agree with the values c, s, tauAlpha and tauBeta imply. A pool that fails
 * this stores a derived set that does not belong to its primary params.
 */
export function derivedParamsAreConsistent(p: EclpRawParams): boolean {
  let cs = p.c.times(p.s);
  let cc = p.c.times(p.c);
  let ss = p.s.times(p.s);

  return (
    matches(p.u, toXp(cs.times(p.tauBetaX.minus(p.tauAlphaX)))) &&
    matches(p.v, toXp(ss.times(p.tauBetaY).plus(cc.times(p.tauAlphaY)))) &&
    matches(p.w, toXp(cs.times(p.tauBetaY.minus(p.tauAlphaY)))) &&
    matches(p.z, toXp(cc.times(p.tauBetaX).plus(ss.times(p.tauAlphaX)))) &&
    matches(p.dSq, toXp(cc.plus(ss).times(ONE_XP)))
  );
}

/**
 * True when a and b agree to within a relative tolerance. Expressed as a division of the larger operand
 * rather than a multiplication of the difference, so the comparison adds no width of its own.
 */
function matchesRelative(a: BigInt, b: BigInt, tolInverse: BigInt): boolean {
  let scale = a.abs();
  let bAbs = b.abs();
  if (bAbs.gt(scale)) {
    scale = bAbs;
  }
  return a.minus(b).abs().le(scale.div(tolInverse));
}

/**
 * True when the tau vector stored for a price bound is the one that bound implies.
 *
 * The pool's own math defines tau(px) = eta(zeta(px)) with eta(x) = (x, 1)/sqrt(x^2 + 1), so the square
 * root is a common factor of both components and cancels in their ratio:
 *
 *   tau.x / tau.y == zeta(px) == lambda * (c*px - s) / (c + s*px)
 *
 * Cross-multiplied so nothing is truncated before the comparison, with px, c, s and lambda at 18 decimals
 * and the tau components at 38:
 *
 *   tau.x * 1e18 * (c*1e18 + s*px) == tau.y * lambda * (c*px - s*1e18)
 *
 * This is the sqrt-free half of the check the pool constructor skips: it ties the derived params back to
 * the displayed price bounds, which the u/v/w/z/dSq identity alone does not do. A pool can carry a
 * perfectly self-consistent derived set built on tau vectors belonging to entirely different bounds, and
 * then it trades on a range other than the one it advertises.
 *
 * The widest intermediate here is about 330 bits, past int256 but far inside graph-node's BigInt, whose
 * limit is 435412 bits and which arithmetic does not check against at all.
 */
function tauMatchesBound(
  p: EclpRawParams,
  px: BigInt,
  tauX: BigInt,
  tauY: BigInt
): boolean {
  let lhs = tauX.times(E18).times(p.c.times(E18).plus(p.s.times(px)));
  let rhs = tauY.times(p.lambda).times(p.c.times(px).minus(p.s.times(E18)));
  return matchesRelative(lhs, rhs, TAU_TOL_INV);
}

/**
 * True when tauAlpha and tauBeta are the tau images of the pool's own alpha and beta.
 */
export function tauMatchesBounds(p: EclpRawParams): boolean {
  return (
    tauMatchesBound(p, p.alpha, p.tauAlphaX, p.tauAlphaY) &&
    tauMatchesBound(p, p.beta, p.tauBetaX, p.tauBetaY)
  );
}

/**
 * True when both tau vectors are unit vectors. Together with tauMatchesBounds, which fixes their
 * direction, and the tau.y > 0 the pool enforces, this pins tau exactly.
 */
export function tauVectorsAreNormalized(p: EclpRawParams): boolean {
  return (
    matchesRelative(
      p.tauAlphaX.times(p.tauAlphaX).plus(p.tauAlphaY.times(p.tauAlphaY)),
      ONE_XP_SQ,
      NORM_TOL_INV
    ) &&
    matchesRelative(
      p.tauBetaX.times(p.tauBetaX).plus(p.tauBetaY.times(p.tauBetaY)),
      ONE_XP_SQ,
      NORM_TOL_INV
    )
  );
}
