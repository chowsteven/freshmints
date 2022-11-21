<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/chowsteven/refreshmints">
    <img src="https://user-images.githubusercontent.com/106450121/202951006-a6bb0970-fb52-42e9-b427-7ccb93880169.png" alt="Logo" width="80" height="80">
  </a>


  <h3 align="center">Refreshmints</h3>
  <p align="center">An Ethereum NFT minting bot</p>

</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#lessons-learned-and-afterthoughts">Lessons Learned and Afterthoughts</a></li>
  </ol>
</details>




<!-- ABOUT THE PROJECT -->
## About The Project
**Quick demo (sorry it's a little hard to see) 👇**

![ezgif-1-3a0acda0b3](https://user-images.githubusercontent.com/106450121/202951094-88d71b15-43cc-4080-aebd-d62d865f913e.gif)

A desktop application that lets you automatically mint NFTs with multiple wallets simultaneously. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![Electron][Electron.js]][Electron-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Tailwind][TailwindCSS]][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

**CAUTION:** I still have lots of work to do on this. Use the program at this stage at your own risk. You are responsible for anything that happens! Take a look at my roadmap for my future plans. Feel free to reach out to me if you have any questions/feedback.

To get a local copy up and running, follow these steps

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
  
* Get a free API Key at [Etherscan](https://etherscan.io)
* Get a free API endpoint from a provider of your choice (popular ones include [Alchemy](https://alchemy.com) and [Infura](https://infura.io))

### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/chowsteven/refreshmints.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Fix Webpack & native dependencies bug
- [ ] Fix error statuses
- [ ] Add automatic mode
- [ ] Add task groups

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

For now, please open a new issue!

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Special thanks to

* [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) for the quickstart
* [Ethers](https://docs.ethers.io/v5/) for the Ethereum API
* [Etherscan](https://etherscan.io) for the real-time Ethereum information

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LESSONS LEARNED -->
## Lessons Learned and Afterthoughts

This project was my first desktop application. I wanted to get this up and running quickly so I decided to stick with TypeScript, which I was already familiar with. Electron seemed to be the best framework to use for such a project. If I had decided to use a different language, I would have went with Python because I've been meaning to dust off the cobwebs for it recently.

Anyway, I came across a lot of challenges when using Electron - learning the inter-process communication, things about security and writing to the file system.. a bunch of the "usual" challenges, from what I can tell. I would say it was pretty difficult but rewarding; it was kind of cool using a browser language for a desktop application. So big props to the people at Electron.

It was also fun learning about the intricacies of Ethereum and the mempool and all that, but most of the heavy lifting was done by the Ethers library. It was really easy to get things going because of the great Ethers API!

There's a lot more to that I need to implement. The two most important ones are getting the dependencies right so Webpack stops yelling and fixing the errors that are displayed to the user. Coming soon...


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://typescriptlang.org/
[Electron.js]: https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white
[Electron-url]: https://www.electronjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/

