import NavbarComponent from "../component/Navbar";
import SelectBranch from "../component/SelectBranch";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

function BranchPage() {
  return (
    <div>
      <NavbarComponent />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <h3>Please select branch to manage</h3>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1rem;
            @media (max-width: 720px) {
              flex-direction: column;
            }
          `}
        >
          <SelectBranch />
        </div>
      </div>
    </div>
  );
}

export default BranchPage;
