import NavbarComponent from "../component/Navbar";
import FeatureList from "../component/FeatureList";
import Status from "../component/Status";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

function HomePage() {
  return (
    <div>
      <NavbarComponent />
      <div
        css={css`
          display: flex;
          justify-content: center;
          gap: 2rem;

          @media (max-width: 720px) {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        <Status />
        <FeatureList />
      </div>
    </div>
  );
}

export default HomePage;
