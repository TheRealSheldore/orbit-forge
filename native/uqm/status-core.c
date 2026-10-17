//Copyright Paul Reiche, Fred Ford. 1992-2002

/*
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

#include "uqm/ship.h"
#include "uqm/collide.h"
#include "uqm/globdata.h"
#include "uqm/status.h"
#include "uqm/setup.h"
#include "options.h"
#include "uqm/sounds.h"
#include "libs/mathlib.h"

COORD status_y_offsets[2];
BOOLEAN
DeltaEnergy (ELEMENT *ElementPtr, SIZE energy_delta)
{
	BOOLEAN retval;
	STARSHIP *StarShipPtr;
	SHIP_INFO *ShipInfoPtr;

	retval = TRUE;

	GetElementStarShip (ElementPtr, &StarShipPtr);
	ShipInfoPtr = &StarShipPtr->RaceDescPtr->ship_info;
	if (energy_delta >= 0)
	{
		if ((BYTE)(ShipInfoPtr->energy_level + (BYTE)energy_delta) >
				ShipInfoPtr->max_energy)
			energy_delta = ShipInfoPtr->max_energy
					- ShipInfoPtr->energy_level;
	}
	else
	{
		if ((BYTE)-energy_delta > ShipInfoPtr->energy_level)
		{
			retval = FALSE;
		}
	}

	if (!retval)
		StarShipPtr->cur_status_flags |= LOW_ON_ENERGY;
	else
	{
		StarShipPtr->cur_status_flags &= ~LOW_ON_ENERGY;
		StarShipPtr->energy_counter =
				StarShipPtr->RaceDescPtr->characteristics.energy_wait;

		DeltaStatistics (ShipInfoPtr, status_y_offsets[StarShipPtr->playerNr],
				0, energy_delta);
	}

	return (retval);
}
BOOLEAN
DeltaCrew (ELEMENT *ElementPtr, SIZE crew_delta)
{
	BOOLEAN retval;
	STARSHIP *StarShipPtr;
	SHIP_INFO *ShipInfoPtr;

	if (LOBYTE (GLOBAL (CurrentActivity)) == IN_LAST_BATTLE
			&& ElementPtr->playerNr == NPC_PLAYER_NUM)
		return (TRUE); /* Samatra can't be crew-modified */

	retval = TRUE;
	GetElementStarShip (ElementPtr, &StarShipPtr);
	ShipInfoPtr = &StarShipPtr->RaceDescPtr->ship_info;
	if (crew_delta > 0)
	{
		ElementPtr->crew_level += crew_delta;
		if (ElementPtr->crew_level > ShipInfoPtr->max_crew)
		{
			crew_delta = ShipInfoPtr->max_crew - ShipInfoPtr->crew_level;
			ElementPtr->crew_level = ShipInfoPtr->max_crew;
		}
	}
	else if (crew_delta < 0)
	{
		if (ElementPtr->crew_level > (COUNT)-crew_delta)
			ElementPtr->crew_level += crew_delta;
		else
		{
			crew_delta = -(SIZE)ElementPtr->crew_level;
			ElementPtr->crew_level = 0;
			retval = FALSE;
		}
	}

	DeltaStatistics (ShipInfoPtr, status_y_offsets[StarShipPtr->playerNr],
			crew_delta, 0);

	return (retval);
}
