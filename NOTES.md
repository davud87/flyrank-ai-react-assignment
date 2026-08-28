# Accessibility Component Notes

## Approach

I first implemented the modal dialog, tabs, and disclosure manually in `playground/` against the W3C ARIA Authoring Practices Guide patterns. After those components passed keyboard-focused tests, I initialized shadcn/ui with the Radix base, generated Dialog and Tabs, and inspected the generated files plus the installed Radix primitive behavior they wrap.

## Modal Dialog

### What my version handled

- Uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and optional `aria-describedby`.
- Moves focus into the dialog when it opens, using an explicit `initialFocusRef` when provided.
- Traps normal Tab navigation inside the dialog, including Tab from the last focusable element to the first and Shift+Tab from the first to the last.
- Closes on Escape and returns focus to the opener after the dialog has been opened.
- Provides visible close controls and uses component-scoped refs for dialog focus queries.

### What shadcn handled differently or more completely

1. The generated shadcn Dialog delegates behavior to Radix `DialogPrimitive.Content`, which uses `FocusScope` with `loop` and `trapped`. That covers keyboard focus, pointer focus, and programmatic focus containment. My implementation traps normal Tab key movement, but it does not provide the same primitive-level containment for every way focus can leave.
2. Radix uses `DismissableLayer` and `disableOutsidePointerEvents` for modal outside-content behavior. My dialog keeps background content out of the normal Tab sequence through the focus trap, but it does not manage outside pointer interactions as comprehensively.
3. Radix calls `hideOthers(content)`, described in the installed source as a better-supported equivalent to setting modal state for assistive tech. My version sets `aria-modal="true"` but does not also aria-hide every outside subtree.
4. Radix portals the overlay/content and adds focus guards because dialog content may be the last element in the DOM. My version renders where it is used in the React tree, which is simpler but less robust for nested layout and stacking contexts.
5. Radix includes scroll handling through `RemoveScroll`, while still allowing the dialog content to scroll. My version limits dialog height and allows the dialog itself to scroll, but it does not lock document scrolling or account for pinch zoom.

### What I learned

The core APG behavior is achievable by hand for a focused exercise, but a production dialog has more edge cases than Tab wrapping: outside pointer behavior, assistive-tech isolation, scroll locking, portal layering, animation mount states, and focus restoration all interact.

## Tabs

### What my version handled

- Uses `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, and roving `tabIndex`.
- Implements horizontal ArrowRight, ArrowLeft, Home, and End focus movement with wrapping.
- Uses manual activation: arrow keys move focus only, and Enter or Space changes the selected tab and active panel.
- Keeps only the selected tab in the normal Tab order with `tabIndex={0}`.

### What shadcn handled differently or more completely

1. The generated shadcn Tabs wrap Radix Tabs, which use `RovingFocusGroup`. That primitive supports orientation, direction, loop configuration, and disabled triggers. My version implements a horizontal-only, always-wrapping group and does not handle disabled tabs.
2. Radix exposes `activationMode="automatic" | "manual"`. My version intentionally implements manual activation only for the assignment, so it does not provide a reusable switch between automatic and manual behavior.
3. Radix supports controlled and uncontrolled selection through `value`, `defaultValue`, and `onValueChange`. My version owns its selected index internally and is sufficient for the playground, but it is less composable.
4. Radix generates trigger/content IDs from a shared base ID and tab value, and the primitive keeps the associations consistent across composed components. My version also associates tabs and panels correctly, but it expects one local `items` array rather than supporting distributed component composition.
5. Radix prevents accidental activation for disabled triggers and non-left mouse interactions. My simple implementation does not include those pointer edge cases.

### What I learned

Manual tabs are a good way to understand roving focus and manual activation, but reusable tabs need to handle orientation, text direction, disabled states, and controlled state without making every caller reimplement the same decisions.

## Disclosure

The disclosure is intentionally simple and uses a native `<button>`. That means Enter, Space, focus, and click activation come from the browser instead of custom keyboard code. The component adds `aria-expanded`, `aria-controls`, and a matching controlled region. The assignment did not ask for a shadcn disclosure comparison.

## Keyboard testing performed

- Modal: opening the dialog, initial focus movement, Escape close, focus restoration to the opener, Tab wrapping from last to first, and Shift+Tab wrapping from first to last.
- Tabs: ArrowRight, ArrowLeft, wrapping from first to last, Home, End, Enter activation, Space activation, roving `tabIndex`, and selected panel changes.
- Disclosure: Enter toggling, Space toggling, visibility updates, and `aria-expanded` changes.

## Conclusion

The handcrafted components demonstrate the underlying ARIA patterns directly, which is useful for learning. shadcn's generated code stays open and inspectable, but delegates the hardest accessibility edge cases to Radix primitives. The biggest takeaway is that component libraries are most valuable when they preserve the semantics while also covering edge cases that are easy to miss in a first manual implementation.
