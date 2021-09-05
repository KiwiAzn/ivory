import { atomWithLocalStorage } from "./utils";

const nameAtom = atomWithLocalStorage<string | undefined>("name", undefined);

export default nameAtom;
