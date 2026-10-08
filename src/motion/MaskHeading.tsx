import { CSSProperties, ElementType, ReactNode, useLayoutEffect, useRef, useState } from "react";

type LineBox = { left: number; top: number; width: number; height: number };

/**
 * Headline with the DentaWorth accent-block reveal: a sky-blue block sweeps
 * across each rendered line, holds while every line is covered, then
 * retracts to the right, uncovering the text and collapsing to a caret.
 *
 * Line boxes are measured from the live layout (getClientRects), so the
 * effect follows whatever wrapping the viewport produces. The text itself is
 * ordinary heading content, so screen readers and search engines see a
 * normal heading. Without `html.motion-ok` the blocks never render.
 */
export function MaskHeading({
  as: Tag = "h2",
  children,
  className = "",
  id,
  delay = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Extra delay (ms) before the sweep starts once the heading is in view. */
  delay?: number;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [lines, setLines] = useState<LineBox[]>([]);
  const measureRef = useRef<() => void>(() => undefined);
  const measuredTextRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return;

    function measure() {
      if (!root || !text) return;
      measuredTextRef.current = text.textContent;
      const rootBox = root.getBoundingClientRect();
      const boxes: LineBox[] = [];

      for (const rect of Array.from(text.getClientRects())) {
        if (rect.width < 1 || rect.height < 1) continue;
        const box = {
          left: rect.left - rootBox.left,
          top: rect.top - rootBox.top,
          width: rect.width,
          height: rect.height,
        };
        // Nested inline children can report several fragments on one line; merge them.
        const sameLine = boxes.find((existing) => Math.abs(existing.top - box.top) < box.height * 0.5);
        if (sameLine) {
          const right = Math.max(sameLine.left + sameLine.width, box.left + box.width);
          sameLine.left = Math.min(sameLine.left, box.left);
          sameLine.width = right - sameLine.left;
        } else {
          boxes.push(box);
        }
      }

      setLines((previous) => (sameBoxes(previous, boxes) ? previous : boxes));
    }

    measureRef.current = measure;
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => resizeObserver.disconnect();
  }, []);

  // Re-measure only when the rendered text actually changes, not on every parent render.
  useLayoutEffect(() => {
    if (textRef.current && textRef.current.textContent !== measuredTextRef.current) measureRef.current();
  });

  return (
    <Tag
      ref={rootRef}
      id={id}
      className={`mask-heading ${className}`.trim()}
      data-reveal="mask"
      style={{ "--lines": Math.max(lines.length, 1), "--delay": `${delay}ms` } as CSSProperties}
    >
      <span ref={textRef} className="mask-heading__text">
        {children}
      </span>
      <span className="mask-heading__blocks" aria-hidden="true">
        {lines.map((line, index) => (
          <span
            key={index}
            className="mask-heading__block"
            style={
              {
                left: line.left,
                top: line.top,
                width: line.width,
                height: line.height,
                "--line": index,
              } as CSSProperties
            }
          />
        ))}
      </span>
    </Tag>
  );
}

function sameBoxes(a: LineBox[], b: LineBox[]) {
  if (a.length !== b.length) return false;
  return a.every(
    (box, index) =>
      Math.abs(box.left - b[index].left) < 0.5 &&
      Math.abs(box.top - b[index].top) < 0.5 &&
      Math.abs(box.width - b[index].width) < 0.5 &&
      Math.abs(box.height - b[index].height) < 0.5,
  );
}
