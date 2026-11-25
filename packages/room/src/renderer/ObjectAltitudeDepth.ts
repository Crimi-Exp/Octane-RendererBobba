import { AvatarAction, IRoomObject, IRoomObjectSpriteVisualization, RoomObjectUserType, RoomObjectVariable } from '@octane/api';

// Sort-depth weight per unit of object altitude. The geometry's depth vector is
// nearly horizontal (0.5° vertical angle), so altitude alone contributes almost
// nothing to painter ordering. Classic ride-on furniture depends on it: queue
// tiles push their layers back 0.9 tiles (asset z -900) and expect the rider's
// altitude (0.45) to cover the remaining fraction of the tile step (sqrt(0.5)
// per tile). 0.2 gives a 0.45-high rider ~0.09 depth (> the 0.071 shortfall),
// while a closer tile still outranks anything elevated less than ~3.5 units.
export const OBJECT_ALTITUDE_DEPTH: number = 0.2;

// The riding effect; its wearer stands this high above the pet.
export const RIDING_EFFECT_ID: number = 77;
export const RIDER_MOUNT_HEIGHT: number = 1;

// How much of an object's altitude is weighted into its sort depth.
//
// A unit resting on furniture must still sort against that furniture's own
// layers: a sofa pushes its front layers barely a hundredth of a unit ahead of
// the seat, so weighting the seat height - a whole unit - paints the sitter over
// the armrests. The floor under the seat is weighted all the same: it is the
// altitude the seat itself is weighted by, and dropping it lets a step in the
// room push the sofa 0.2 forward of its own sitter, which paints the whole seat
// over the avatar. Ride-on furniture carries standing riders, so it keeps the
// full weighting. A pet's rider is weighted at the pet's altitude, so the
// pet's own layer depths decide which of its parts cover the rider.
// BobbaTok : a furni layer pushed back at least this far (relative depth) belongs to ride-on furniture
// (rollers and queue tiles push theirs back 0.9 tiles, asset z -900 = 0.64).
export const PUSHED_BACK_LAYER_DEPTH: number = 0.3;

/** A unit (avatar, bot, pet, monster plant) rather than a furni. */
export const isUnitObject = (object: IRoomObject): boolean =>
    !!object && ((RoomObjectUserType.getTypeNumber(object.type) !== undefined) || (object.type === RoomObjectUserType.MONSTER_PLANT));

/** BobbaTok : room helpers that are not furni (the tile cursor follows the mouse onto a seat's tile). */
const NON_FURNI_TYPES: ReadonlySet<string> = new Set([ 'tile_cursor', 'selection_arrow', 'room', 'floor_editor' ]);

export const isStackableFurni = (object: IRoomObject): boolean => !!object && !isUnitObject(object) && !NON_FURNI_TYPES.has(object.type);

/** The shadow layer of a furni (asset ..._sd_...). */
const isShadowSprite = (sprite: { name?: string }): boolean => !!sprite?.name && /_sd_/.test(sprite.name);

/** A furni whose layers are pushed back, like a roller: what stands on it must clear the next one. */
const hasPushedBackLayers = (object: IRoomObject): boolean =>
{
    const visualization = object?.visualization as IRoomObjectSpriteVisualization;

    if(!visualization?.sprites) return false;

    for(const sprite of visualization.sprites.values())
    {
        if(!sprite || !sprite.visible || (sprite.relativeDepth < PUSHED_BACK_LAYER_DEPTH)) continue;

        // a furni's shadow is always pushed back a whole tile: it says nothing about rollers
        if(isShadowSprite(sprite)) continue;

        return true;
    }

    return false;
};

/**
 * BobbaTok : does a ride-on furni (roller, queue tile) lie under this altitude on the object's tile?
 * Only then does a furni (or a seat) need its altitude weighted: a furni stacked on any other furni (:setz,
 * stack helper) sorts by the layer depths of the two furni, as on Habbo, so the front parts of the lower one
 * (a throne's armrests) still cover what sits inside it.
 */
export const restsOnRideFurniture = (object: IRoomObject, objects: Iterable<IRoomObject>): boolean =>
{
    const location = object?.getLocation();

    if(!location || !objects) return false;

    const x = Math.round(location.x);
    const y = Math.round(location.y);

    for(const other of objects)
    {
        if(!other || (other === object) || !isStackableFurni(other)) continue;

        const otherLocation = other.getLocation();

        if(!otherLocation || (Math.round(otherLocation.x) !== x) || (Math.round(otherLocation.y) !== y)) continue;
        if(otherLocation.z >= (location.z - 0.01)) continue;

        if(hasPushedBackLayers(other)) return true;
    }

    return false;
};

/**
 * @param onRideFurniture for a furni or a seated unit: whether a ride-on furni lies under it (restsOnRideFurniture).
 *        Leave it undefined to weight the altitude as before (standing units always are).
 */
export const getObjectAltitudeDepth = (object: IRoomObject, onRideFurniture?: boolean): number =>
{
    const altitude = object.getLocation().z;

    // BobbaTok : a furni weighs its altitude only on a roller ; elsewhere its layers decide (Habbo sorting)
    if((onRideFurniture !== undefined) && !isUnitObject(object)) return (onRideFurniture ? (altitude * OBJECT_ALTITUDE_DEPTH) : 0);

    const posture = object.model?.getValue<string>(RoomObjectVariable.FIGURE_POSTURE);

    if((posture === AvatarAction.POSTURE_SIT) || (posture === AvatarAction.POSTURE_LAY))
    {
        // the seat surface the unit was raised to, reported by the unit status
        const seatHeight = (object.model?.getValue<number>(RoomObjectVariable.FIGURE_VERTICAL_OFFSET) || 0);

        // BobbaTok : weighted like its seat, which only weighs its altitude on a roller
        if(onRideFurniture === false) return 0;

        return ((altitude - seatHeight) * OBJECT_ALTITUDE_DEPTH);
    }

    if(object.model?.getValue<number>(RoomObjectVariable.FIGURE_EFFECT) === RIDING_EFFECT_ID)
    {
        return (Math.max(0, (altitude - RIDER_MOUNT_HEIGHT)) * OBJECT_ALTITUDE_DEPTH);
    }

    return (altitude * OBJECT_ALTITUDE_DEPTH);
};
