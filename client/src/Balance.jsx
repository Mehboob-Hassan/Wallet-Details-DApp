import { useEffect, useState } from 'react';
import "./App.css"
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Card } from 'react-bootstrap';

export default function Balances() {
  const [balances, setBalances] = useState({});
  const [address, setAddress] = useState();
  const [chain, setChain] = useState('GOERLI');
  const [loading, setLoading] = useState(false)

  console.log(address)
  console.log(chain)

  const fetchData = async () => {
    setLoading(true);
    axios.post('http://localhost:5000/balances', { address, chain })
      .then(({ data }) => {
        setBalances(data);
      })
      .catch((err) => {
        console.log("Error in Axios", err);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  // RENDER BUTTON/LOADER
  const renderBtn = () => {
    if (loading) {
      return <Button >Loading...</Button>
    } else {
      return <Button onClick={fetchData}>Submit</Button>
    }
  }

  return (
    <>
      <div className='balances'>
        <Container className='form-container'>
          <div className='heading'>
            <h2>Moralis Account Details DApp</h2>
            <h4>Get your wallet Balances by only giving your wallet address</h4>
          </div>
          <Form className='shadow'>
            <Form.Group className="mb-3 input">
              <Form.Control onChange={(e) => setAddress(e.target.value)} type='text' placeholder='Enter your wallet address' />
            </Form.Group>
            <Form.Group className='input'>
              <Form.Select value={chain} onChange={(e) => setChain(e.target.value)}>
                <option value="BSC">BSC</option>
                <option value="BSC_TESTNET">BSC Testnet</option>
                <option value="ETHEREUM">ETHEREUM</option>
                <option value="GOERLI">Goerli</option>
              </Form.Select>
            </Form.Group>
            {renderBtn()}
          </Form>

          {(balances.nativeBalance) &&
            <Card className='resulCard'>
              <h3><span> Balance:</span> <span>{balances.nativeBalance.slice(0, 5)}ETH</span> </h3>
              {(balances.tokenBalances).map((x, y) => (
                <h3>Token Balances[{y}]: <span>{x}</span></h3>)
              )}

            </Card>
          }

          <footer className="footer">
            Made with &#10084;&#65039; by Mehboob Hassan
          </footer>
        </Container>

      </div>
    </>
  );
}