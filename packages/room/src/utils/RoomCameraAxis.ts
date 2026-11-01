/**
 * BobbaTok patch 142 / 143 / 144 (BobbaTok patch 119 et suivants) : regle de la camera de l'appart, axe par axe.
 *
 * La camera de Habbo centrait l'appart des qu'il tenait dans l'ecran, en comptant tout le sol (sol invisible, wireds
 * ranges loin du decor...), et sinon s'arretait au bord de l'appart : le decor restait sur le cote.
 * Ici la camera suit toujours l'avatar du joueur, quelle que soit la taille de l'appart (patch 144),
 * meme si on voit le fond au-dela du bord de l'appart.
 * ROOM_CAMERA_CENTER_FRACTION remet l'ancien centrage des petits apparts si on le monte (0.7 = moins de 70 % de l'ecran).
 * Les valeurs sont en cases (unites de la camera), les tailles en pixels.
 */
export const ROOM_CAMERA_CENTER_FRACTION = 0;

export interface RoomCameraAxisResult
{
    value: number;
    centered: boolean;
    limited: boolean;
}

export const resolveRoomCameraAxis = (wanted: number, boundMin: number, boundMax: number, halfCanvasInTiles: number, boundsPx: number, canvasPx: number, centerFraction: number = ROOM_CAMERA_CENTER_FRACTION): RoomCameraAxisResult =>
{
    if(boundsPx < (canvasPx * centerFraction)) return { value: ((boundMax + boundMin) / 2), centered: true, limited: false };

    return { value: wanted, centered: false, limited: false };
};
