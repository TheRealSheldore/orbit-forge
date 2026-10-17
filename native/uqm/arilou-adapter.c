/* GPL-2.0-or-later. Keep the original Skiff ability tactical in the larger arena.
 * All ship logic remains in the supplied original source. Only the random
 * destination mapping is restricted to a local 10-block box on each axis.
 * The original landing-safety checks still run at the chosen destination.
 */
#include "uqm/units.h"
#undef DISPLAY_ALIGN_X
#undef DISPLAY_ALIGN_Y
#define DISPLAY_ALIGN_X(random_value) ((COORD)(ElementPtr->current.location.x + ((int)((COUNT)(random_value) % 1281) - 640)) & ~(SCALED_ONE-1))
#define DISPLAY_ALIGN_Y(random_value) ((COORD)(ElementPtr->current.location.y + ((int)((COUNT)(random_value) % 1281) - 640)) & ~(SCALED_ONE-1))
#include "uqm/ships/arilou/arilou.c"
