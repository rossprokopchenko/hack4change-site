import {
  LeavePageActionsContext,
  LeavePageContext,
} from "@/services/leave-page/leave-page-context";
// Need for leave page logic
// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps } from "next/link";
import { Ref, useContext } from "react";

/**
 * Custom Link component that handles leave-page confirmations.
 * Language prefix logic has been removed since we now use cookie-based language detection.
 */
function Link(props: LinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  const { isLeavePage } = useContext(LeavePageContext);
  const { setLeavePage, openModal } = useContext(LeavePageActionsContext);
  const href = props.href;

  return (
    <NextLink
      ref={props.ref}
      {...props}
      href={href}
      onClick={(e) => {
        if (isLeavePage) {
          e.preventDefault();
          setLeavePage({
            [props.replace ? "replace" : "push"]: href,
          });
          openModal();
        } else {
          props.onClick?.(e);
        }
      }}
    />
  );
}

export default Link;

