import { css } from 'styled-components';

const style = () => css`

  .custom-row {
    align-items: center;
    justify-content: center;
    background-color: #dfdfdf;
  }
  .source-container {
    background-color: #fff;
    display: flex;
    margin-bottom: 20px;
    display: flex;
    box-shadow: 0 1px 1px 0 rgba(10,22,70,.1), 0 0 1px 0 rgba(10,22,70,.06);
    border-radius: 4px;
    cursor: pointer;
    .content-container {
      flex: 2;
      flex-direction: column;
      display: flex;
      justify-content: center;
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .content {
        font-size: 16px;
      }
    }
  
    .icon-container {
      flex: 1;
      flex-direction: row;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export { style };