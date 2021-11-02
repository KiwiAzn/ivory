import { atomWithStorage } from "jotai/utils";

const nameAtom = atomWithStorage<string | undefined>("name", undefined);

export default nameAtom;
