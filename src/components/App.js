import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json'


class App extends Component {

  constructor(props){
    super(props)
    this.state={
      account:'',
      contract: null,
      totalSupply: 1,
      colors: []
    }
  }

  async loadWeb3() {
      console.log("loadWeb3");

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts() //gets accout from metamask
    this.setState({ account: accounts[0] })//state store property values of a componet and when the state chages the componet re-renders
    const networkId = await web3.eth.net.getId() //detercts the eth network 
    const networkData = Color.networks[networkId] //gets the contracts address on the network
    if(networkData) {//if it has an addres
      const abi = Color.abi //creates a JS version of the contract with its abi
      const address = networkData.address //its actual address?
      console.log("networkData:",networkData);
      console.log("addy",address);
      console.log("abi:",abi);

      const returnContract = new web3.eth.Contract(abi, address)//creates a new version of this contract
      // web3.eth.defaultAccount(address);
      // const returnContract = new web3.eth.Contract(abi);
      this.setState({ contract:returnContract })//sets it in state obj
      // console.log("contractName:",returnContract.contractName);
      console.log("contract:",this.state.contract);

      const returntotalSupply = await returnContract.methods.totalSupply().call()//calls a contracts method
      console.log("supply",this.state.totalSupply)
      this.setState({ totalSupply:returntotalSupply }) //sets state var
      // Load Colors
      for (var i = 1; i <= returntotalSupply; i++) {
        const color = await returnContract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  //javascript arrow function =>
  // () define the list of pramaters followed by "fat arrow" => and {} that delimit the functions body
  // ... is spread syntax which expands an iterable like an array or string 
  //
  // this callwebs the mint method in the contract with seend passing the accout
  // .once is a promiss event that watches for events like'receipt' and then can call a function with it
  // when we get a receipt event we call setstate and add the color we justed mined to the list
  
// //#dc34eb
//   mint = (color) => {
//     this.state.contract.methods
//         // this.state.contract

//     .mint(color)
//     .send({ from: this.state.account })
//     .once('receipt',
//        (receipt) => {
//           this.setState(
//             {
//             colors: [...this.state.colors, color]
//             }
//           )
//         }
//     )
//   }

  mint = (color) => {
    this.state.contract.mint(color)
    .call({from: this.state.account})
    .once('receipt',
       (receipt) => {
          this.setState(
            {
            colors: [...this.state.colors, color]
            }
          )
        }
    )
  }
render() {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Color Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{this.state.account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
              <form onSubmit={(event) => {
                event.preventDefault()
                const color = this.color.value
                this.mint(color)
              }}>
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='e.g. #FFFFFF'
                  ref={(input) => { this.color = input }}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='MINT'
                />
              </form>
            </div>
          </main>
        </div>
        <hr/>
        <div className="row text-center">
          { this.state.colors.map((color, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: color }}></div>
                <div>{color}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
 }
  // render() {
  //   return (
  //     <div>
  //       <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
  //         <a
  //           className="navbar-brand col-sm-3 col-md-2 mr-0"
  //           href="http://www.TheEverbright.com"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Etherbright
  //         </a>
  //       </nav>
  //       <div className="container-fluid mt-5">
  //         <div className="row">
  //           <main role="main" className="col-lg-12 d-flex text-center">
  //             <div className="content mr-auto ml-auto">
  //               <a
  //                 href="http://www.TheEverbright.com"
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 <img src={logo} className="App-logo" alt="logo" />
  //               </a>
  //               <h1>Etherbright Beta</h1>
  //               <p>
  //                 Edit <code>src/components/App.js</code> and save to reload.
  //               </p>
  //               <a
  //                 className="App-link"
  //                 href="http://www.TheEverbright.com"
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 Etherbright!
  //               </a>
  //             </div>
  //           </main>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
export default App;
