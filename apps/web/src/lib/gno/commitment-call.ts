/**
 * Pure helper to prepare a Gno commitment call description.
 * This does NOT call Adena, does not sign, does not broadcast, 
 * and does not mutate any state.
 * 
 * It purely formats the expected shape of the contract interaction
 * for the user to review.
 */
export function buildCommitIntentCall(intentHash: string, roomId: string, partyA: string, partyB: string) {
  return {
    realm: "gno.land/r/demo/tradewindow/rooms",
    method: "CreateRoomCommitment",
    args: {
      roomId,
      partyA,
      partyB,
      intentHash
    },
    warning: "Preview only. Not signed or broadcast."
  };
}
