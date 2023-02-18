export class LotteryGame {
  private selectedNumbers: number[] = [];
  private drawnNumbers: number[] = [];
  private maxNumber = 59;
  private prizeTable: number[] = [0, 0, 0, 50, 100, 200, 500];
  private numberSelectInputs = document.querySelectorAll<HTMLInputElement>(
    "#number-select input"
  );
  private luckyDipButton =
    document.querySelector<HTMLButtonElement>("#lucky-dip");
  private startGameButton =
    document.querySelector<HTMLButtonElement>("#start-game");
  private resetButton = document.querySelector<HTMLButtonElement>("#reset");

  constructor() {
    this.setupEventListeners();
  }

  private showPrizeModal(prizeAmount: number) {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const message = document.createElement("p");
    message.textContent = `You have won ${prizeAmount}!`;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("close-button");

    const closeModal = () => {
      modalContainer.remove();
      modal.remove();
    };

    closeButton.addEventListener("click", closeModal);

    modal.appendChild(message);
    modal.appendChild(closeButton);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
  }

  private setupEventListeners() {
    this.luckyDipButton.addEventListener("click", () => this.handleLuckyDip());
    this.startGameButton.addEventListener("click", () =>
      this.handleStartGame()
    );
    this.resetButton.addEventListener("click", () => this.handleReset());
  }

  private handleLuckyDip(): void {
    this.selectedNumbers = this.generateRandomNumbers(6);
    this.updateSelectedNumbers();
  }

  private handleStartGame(): void {
    this.drawnNumbers = this.generateRandomNumbers(6);
    this.updateDrawnNumbers();
    this.checkPrize();
  }

  private handleReset(): void {
    this.selectedNumbers = [];
    this.drawnNumbers = [];
    this.updateSelectedNumbers();
    this.updateDrawnNumbers();
  }

  private updateSelectedNumbers(): void {
    for (let i = 0; i < this.numberSelectInputs.length; i++) {
      const input = this.numberSelectInputs[i];
      input.value = this.selectedNumbers[i]
        ? String(this.selectedNumbers[i])
        : "";
    }
  }

  private updateDrawnNumbers(): void {
    for (let i = 0; i < this.drawnNumbers.length; i++) {
      const ball = document.querySelector<HTMLDivElement>(`#ball-${i + 1}`)!;
      const ballNumber = ball.querySelector<HTMLSpanElement>(".ball-number")!;
      const number = this.drawnNumbers[i];

      ballNumber.textContent = number.toString();
      ball.setAttribute("data-number", number.toString());

      if (this.selectedNumbers.includes(number)) {
        ball.classList.add("winning-number");
      } else {
        ball.classList.remove("winning-number");
      }
    }
  }

  private checkPrize(): void {
    const numMatches = this.selectedNumbers.filter((number) =>
      this.drawnNumbers.includes(number)
    ).length;

    if (numMatches >= 3) {
      this.showPrizeModal(this.prizeTable[numMatches]);
    }
  }

  private generateRandomNumbers(
    num: number,
    specificNumbers: number[] = []
  ): number[] {
    const numbers = new Set<number>();

    if (specificNumbers.length > 0) {
      specificNumbers.forEach((num) => numbers.add(num));
    } else {
      while (numbers.size < num) {
        const randomNum = Math.floor(Math.random() * this.maxNumber) + 1;
        numbers.add(randomNum);
      }
    }

    return Array.from(numbers).sort((a, b) => a - b);
  }
}
