import { useSelector } from "react-redux";
import { RootState } from "@/store/app.store";

export function useUser() {
  return useSelector((state: RootState) => state.user);
}
