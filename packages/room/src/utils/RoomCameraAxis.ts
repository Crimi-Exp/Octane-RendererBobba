/**
 * BobbaTok patch 142 (BobbaTok patch 119 et suivants) : regle de la camera de l'appart, axe par axe.
 *
 * La camera de Habbo centrait l'appart des qu'il tenait dans l'ecran, sol invisible compris : un appart au sol
 * invisible tres grand, avec le decor dans un coin, restait decale (surtout au dezoom). Ici :
 *  - l'appart prend moins de 70 % de l'ecran : il est centre (comme avant) ;
 *  - sinon la camera suit l'avatar, bornee : l'appart reste entier a l'ecran s'il y tient, et ne laisse pas de
 *    vide sur les cotes s'il est plus grand (pour un appart plus grand que l'ecran, c'est exactement l'ancien calcul).
 * Les valeurs sont en cases (unites de la camera), les tailles en pixels.
 */
export const ROOM_CAMERA_CENTER_FRACTION = 0.7;

export interface RoomCameraAxisResult
{
    value: number;
    centered: boolean;
    limited: boolean;
}

export const resolveRoomCameraAxis = (wanted: number, boundMin: number, boundMax: number, halfCanvasInTiles: number, boundsPx: number, canvasPx: number): RoomCameraAxisResult =>
{
    if(boundsPx < (canvasPx * ROOM_CAMERA_CENTER_FRACTION)) return { value: ((boundMax + boundMin) / 2), centered: true, limited: false };

    const a = (boundMax - halfCanvasInTiles);
    const b = (boundMin + halfCanvasInTiles);
    const value = Math.max(Math.min(a, b), Math.min(Math.max(a, b), wanted));

    return { value, centered: false, limited: (value !== wanted) };
};
