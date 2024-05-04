import React, { useState, useEffect, RefObject } from "react";

interface UseKeyboardNavigationProps {
  numberOfItems: number;
  parentContainerId: string;
  itemClassName: string;
  parentRef: RefObject<HTMLDivElement>;
  columnGap: number;
}

interface UseKeyboardNavigationReturnType {
  activeItemPosition: number;
  handleKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const useKeyboardNavigation = ({
  numberOfItems,
  parentContainerId,
  itemClassName,
  parentRef,
  columnGap,
}: UseKeyboardNavigationProps): UseKeyboardNavigationReturnType => {
  const [activeItemPosition, setActiveItemPosition] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(0);

  const handleResize = () => {
    const parentContainerWidth =
      document.getElementById(parentContainerId)?.offsetWidth;
    const itemWidth = document.querySelector(`.${itemClassName}`)?.offsetWidth;
    if (!parentContainerWidth || !itemWidth) return;

    const noOfItemsPerRow = Math.floor(
      (parentContainerWidth + columnGap) / (itemWidth + columnGap)
    );
    setItemsPerRow(noOfItemsPerRow);
    parentRef.current?.focus();
  };

  useEffect(() => {
    const isActiveItemDeleted = activeItemPosition > numberOfItems - 1;

    if (isActiveItemDeleted) setActiveItemPosition((prev) => prev - 1);
  }, [numberOfItems]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveUp = (prevIndex: number): number => {
    const finalIndex = prevIndex - itemsPerRow;
    return finalIndex < 0 ? prevIndex : finalIndex;
  };

  const moveDown = (prevIndex: number): number => {
    const finalIndex = prevIndex + itemsPerRow;

    const isItemWasInLastRow = isItemInLastRow(prevIndex);
    return isItemWasInLastRow || finalIndex > numberOfItems - 1
      ? prevIndex
      : finalIndex;
  };

  const moveLeft = (prevIndex: number): number => {
    return Math.max(prevIndex - 1, 0);
  };

  const moveRight = (prevIndex: number): number => {
    return Math.min(prevIndex + 1, numberOfItems - 1);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;
    setActiveItemPosition((prevIndex) => {
      switch (key) {
        case "ArrowUp":
          return moveUp(prevIndex);
        case "ArrowDown":
          return moveDown(prevIndex);
        case "ArrowLeft":
          return moveLeft(prevIndex);
        case "ArrowRight":
          return moveRight(prevIndex);
        default:
          return prevIndex;
      }
    });
  };

  const isItemInLastRow = (index: number): boolean => {
    const lastRowStartIndex =
      Math.floor((numberOfItems - 1) / itemsPerRow) * itemsPerRow;
    return index >= lastRowStartIndex;
  };

  return { activeItemPosition, handleKeyUp };
};

export default useKeyboardNavigation;
