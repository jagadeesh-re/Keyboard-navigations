import React, { useState, useRef } from "react";
import { v4 as uuidV4 } from "uuid";

import useKeyboardNavigation from "./useKeyboardNavigation";
import "./styles.css";

const App = () => {
  const [numberOfItems, setNumberOfItems] = useState<number>(14);
  const parentRef = useRef<HTMLDivElement>(null);

  const { activeItemPosition, handleKeyUp } = useKeyboardNavigation({
    numberOfItems,
    parentContainerId: "itemContainer",
    itemClassName: "item",
    parentRef: parentRef ?? undefined,
    columnGap: 30,
  });

  const renderItems = () => {
    return Array.from({ length: numberOfItems }, (_, index) => (
      <div
        key={uuidV4()}
        className={`item ${index === activeItemPosition ? "active" : ""}`}
      >
        Item {index + 1}
      </div>
    ));
  };

  return (
    <div className="card">
      <h2>Items Card</h2>
      <div
        id="itemContainer"
        className="item-container"
        onKeyDown={handleKeyUp}
        tabIndex={0}
        ref={parentRef}
      >
        {renderItems()}
      </div>

      <div className="items-actions">
        <button onClick={() => setNumberOfItems((prev) => prev + 1)}>
          Add Item
        </button>
        <button onClick={() => setNumberOfItems((prev) => prev - 1)}>
          Remove Item
        </button>
      </div>
    </div>
  );
};

export default App;
