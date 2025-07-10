import { RefObject, useEffect } from "react";

type RefType = RefObject<HTMLElement | null>;

interface IClickOutside {
  containerRef: RefType;
  onClickOutside: () => void;
  ignoredRefs?: RefType[];
}

export function useClickOutside(props: IClickOutside) {
  const { containerRef, ignoredRefs = [], onClickOutside } = props;
  useEffect(() => {
    const isClickInside = (target: Node): boolean => {
      if (containerRef.current?.contains(target)) return true;
      return ignoredRefs.some(ref => ref.current?.contains(target));
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!isClickInside(target)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [containerRef, ignoredRefs, onClickOutside]);
}
