class Client {
    private readonly name: string;
    private textArea: HTMLElement = document.querySelector('.write_msg');
    private sendBtn: HTMLElement = document.querySelector('.msg_send_btn');
    private allMessages: HTMLElement = document.querySelector('.msg_history');
    // @ts-ignore
    private socket = io.connect();

    constructor() {
        this.name = prompt('Enter name');
        this.showMessages();
        this.textArea.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        })
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });
    }

    private sendMessage(): boolean {
        if (this.textArea.value.trim())
            this.socket.emit('send message', {message: this.textArea.value.trim(), name: this.name});
        this.textArea.value = '';

        return true;
    }

    private showMessages(): boolean {
        this.socket.on('add message', (data) => {
            if (data.name === this.name) {
                this.allMessages.innerHTML += ` <div class="outgoing_msg">
                                                    <div class="sent_msg">
                                                        <p>${data.message}</p>
                                                    <span class="time_date">${data.name}</span>
                                                    </div>
                                                </div>`;
            } else {
                this.allMessages.innerHTML += ` <div class="incoming_msg">
                                                    <div class="incoming_msg_img">
                                                        <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                                                    </div>
                                                    <div class="received_msg">
                                                        <div class="received_withd_msg">
                                                            <p>${data.message}</p>
                                                            <span class="time_date">${data.name}</span>
                                                        </div>
                                                    </div>
                                                </div>`;
            }

            this.allMessages.scrollTo({
                top: 1000000000,
                behavior: "smooth"
            });
        });

        return true;
    }
}

new Client();