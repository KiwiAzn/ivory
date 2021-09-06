import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { FunctionComponent, MutableRefObject, Ref } from "react";
import { diceRollsAtom } from "../atoms";
import useWebSocket from "react-use-websocket";
import nameAtom from "../atoms/nameAtom";
import rollDice from "../../utils/rollDice";

interface DiceRoomHandlerProps {
  rollDiceRef?: MutableRefObject<Function | null>;
}

const DiceRoomHandler: FunctionComponent<DiceRoomHandlerProps> = (props) => {
  const router = useRouter();

  const roomId = router.query.roomId as string;

  return roomId ? <_DiceRoomHandler roomId={roomId} {...props} /> : null;
};

interface _DiceRoomHandlerProps extends DiceRoomHandlerProps {
  roomId: string;
}

const _DiceRoomHandler: FunctionComponent<_DiceRoomHandlerProps> = ({
  roomId,
  rollDiceRef,
}) => {
  const [name] = useAtom(nameAtom);
  const [previousDiceRolls, setPreviousDiceRolls] = useAtom(diceRollsAtom);

  const socketUrl = process.env.NEXT_PUBLIC_DICEROOM_BASE_URL
    ? new URL(
        `/room/${roomId}/diceRolls/ws`,
        process.env.NEXT_PUBLIC_DICEROOM_BASE_URL
      )
    : new URL(`/api/room/${roomId}/diceRolls/ws`, window.origin);

  socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";

  const { sendJsonMessage } = useWebSocket(socketUrl.toString(), {
    onMessage: ({ data }) => {
      const diceRoll = JSON.parse(data);

      setPreviousDiceRolls([diceRoll, ...previousDiceRolls]);
    },
  });

  rollDiceRef!.current = (diceNotation: string) => {
    const diceRoll = rollDice(diceNotation);
    diceRoll.rollerName = name;
    sendJsonMessage(diceRoll);
  };

  return null;
};

export default DiceRoomHandler;