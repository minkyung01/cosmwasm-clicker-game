import "./App.css";
import { useState } from "react";
import networkInfo from "./wallet/network_info";
import connectWallet from "./wallet/connect";
import increment from "./contract/increment";
import reset from "./contract/reset";

function App() {
  // connectWallet에서 받아올 값
  const [client, setClient] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [chainId, setChainId] = useState();
  // PLAY 버튼의 visibility 속성을 위한 변수
  const [visible, setVisible] = useState("hidden");
  const [count, setCount] = useState(0);

  // connectWallet 으로 전달할 함수
  const getInfo = (client, address, balance, chainId) => {
    setClient(client);
    setAddress(address);
    setBalance(balance);
    setChainId(chainId);
    setVisible("visible");
  };

  // connectWallet으로 가져온 정보를 초기화
  const disconnect = (event) => {
    setClient();
    setChainId();
    setAddress();
    setBalance();
    setVisible("hidden");
  };

  // 네트워크 별로 chainId에 따라서 DISCONNECT와 CONNECT 버튼이 나타나도록 구현
  const renderBtn = () => {
    return Object.keys(networkInfo).map((id) => {
      if (chainId === id) {
        return (
          <button
            type="button"
            onClick={(event) => disconnect(event)}
            className="disconnect-btn"
          >
            DISCONNECT
          </button>
        );
      }
      return (
        <button
          type="button"
          onClick={(event) =>
            connectWallet(event, networkInfo[id], { getInfo })
          }
          className="connect-btn"
        >
          {networkInfo[id].chainName}
        </button>
      );
    });
  };

  // 지갑과 연결되어 있으면 address와 balance 정보 출력
  const showWalletInfo = () => {
    if (client) {
      return (
        <div className="wallet-info">
          <p>{`address: ${address}`}</p>
          <p>{`balance: ${balance.amount} ${balance.denom}`}</p>
        </div>
      );
    }
  };

  // PLAY 버튼 클릭하면 /play 주소로 이동
  const playGame = () => {
    return (
      <div className="menu">
        {!client && (
            <div>
              Connect your wallet to Juno Testnet
            </div>)}
        {client && (
            <div>
              <div>
                <p>Wallet Connected 😉</p>
                <p>Count: {count}</p>
              </div>

              <button
                  className="play-btn"
                  onClick={
                    async(e) => await incrementCount(1)
                  } style={{visibility: visible}}
              >
                <span>increment</span>
              </button>
              <br/>
              <br/>
              <button
                  className="play-btn"
                  onClick={
                    async(e) => await resetCount(0)
                  } style={{visibility: visible}}
              >
                <span>reset</span>
              </button>
            </div>
        )}
        </div>
    );
  };

  const incrementCount = async(cnt) => {
    setTimeout(() => setCount(count + cnt), 7000);
    await increment(client, address, cnt, chainId, balance.denom);
  };

  const resetCount = async(cnt) => {
    setTimeout(() => setCount(cnt), 7000);
    await reset(client, address, cnt, chainId, balance.denom);
  };

  return (
    <div className="App">
      <header>
        <div className="header-titles">
          <h1>Cosmos Session</h1>
        </div>
      </header>
      <div className="App-container">
        <div className="App-menu-container">
          {playGame()}
          <div className="connect-wallet">{renderBtn()}</div>
        </div>
        {showWalletInfo()}
      </div>
    </div>
  );
}

export default App;
