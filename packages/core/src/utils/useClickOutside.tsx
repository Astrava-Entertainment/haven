import {RefObject, useEffect} from "react";

type RefType = RefObject<HTMLElement | null>;

interface IClickOutside {
  containerRef: RefType;
  onClickOutside: () => void;
  ignoredRefs: RefType[];
}

type Props = IClickOutside;


export function useClickOutside(props: Props) {
  const { containerRef, ignoredRefs, onClickOutside } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }

      for (const ref of ignoredRefs) {
        if (ref.current && ref.current.contains(target)) {
          return;
        }
      }

      onClickOutside();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, onClickOutside, ignoredRefs]);
}
