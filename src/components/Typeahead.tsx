import { useEffect, useMemo, useRef, useState } from "react";

export function Typeahead({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const matches = useMemo(() => {
    const normalized = value.trim().toLowerCase();
    const pool = normalized ? options.filter((option) => option.toLowerCase().includes(normalized)) : options;
    return pool.slice(0, 8);
  }, [options, value]);

  function selectOption(option: string) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="typeahead" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
          if (event.key === "Enter" && matches.length > 0) {
            event.preventDefault();
            selectOption(matches[0]);
          }
        }}
      />
      {isOpen && matches.length > 0 && (
        <ul className="typeahead-menu" role="listbox">
          {matches.map((option) => (
            <li key={option}>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption(option)}>
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
