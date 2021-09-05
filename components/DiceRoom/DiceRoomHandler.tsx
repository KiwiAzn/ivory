import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { FunctionComponent } from "react";
import { diceRollsAtom } from "../atoms";
import useWebSocket from "react-use-websocket";
import { DiceRoll } from "rpg-dice-roller";

const DiceRoomHandler: FunctionComponent = () => {
  const router = useRouter();

  const roomId = router.query.roomId as string;

  return roomId ? <_DiceRoomHandler roomId={roomId}/> : null;
}

interface _DiceRoomHandlerProps {
  roomId: string;
}

const _DiceRoomHandler: FunctionComponent<_DiceRoomHandlerProps> =({roomId}) => {
  const [previousDiceRolls, setPreviousDiceRolls] = useAtom(diceRollsAtom);

  const baseUrl = process.env.NEXT_PUBLIC_DICEROOM_BASE_URL ?? window.origin;

  const socketUrl = new URL(`/room/${roomId}/diceRolls/ws`, baseUrl);
  socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';

  const {
  } = useWebSocket(socketUrl.toString(), {onMessage: ({data}) => {
    const dataAsJson = JSON.parse(data);

    const diceRoll = {
      rolls: [dataAsJson.resultBreakdown],
      notation: dataAsJson.diceNotation,
      total: dataAsJson.result,
    } as DiceRoll;

    setPreviousDiceRolls([...previousDiceRolls, diceRoll]);
  }});



  return null;
} 

export default DiceRoomHandler