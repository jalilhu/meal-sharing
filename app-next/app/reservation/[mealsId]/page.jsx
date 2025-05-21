'use client';
import { useSearchParams } from 'next/navigation';

const newDate = new Date()
export default function ReservePage() {
    const searchParams = useSearchParams()
    const title = searchParams.get("title")
    const id = searchParams.get("id")
    const price = searchParams.get("price")
    const maxRes = Number(searchParams.get("amount"))
    const date = searchParams.get("date")
    const when = convertToDate(date)
    console.log(title, id)

    return (
        <div>
            <div>
                <h2>Reservation of {title}</h2>
                <p>{price}$/serving</p>
                <p>Amount: {maxRes}</p>
                <p>Available on {when}</p>
            </div>
            <div>
                <label id='guestLabel' htmlFor='number-of-guests'>Number of guests  </label>
                <input
                    id="number-of-guests"
                    type="number"
                    placeholder={`Only ${maxRes} available`}
                    min={1}
                    max={maxRes}
                />

                <label id='createdLabel' htmlFor='created_date'> Created at:  </label>
                <input id='created_date' type='date' placeholder='Created at' />

                <label id='contactLabel' htmlFor='contact_phonenumber'>Phone Number: </label>
                <input id='contact_phonenumber' type='text' placeholder='Phone Number' />

                <label id='guestLabel' htmlFor='name'> Name  </label>
                <input id='name' type='text' placeholder='name' />
            </div>

        </div>
    )
}


function convertToDate(date) {
    const dateString = date;
    const regex = /^(\d{4})-(\d{2})-(\d{2})/;
    const match = dateString.match(regex);

    if (match) {
        const [, year, month, day] = match;

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const formattedDate = `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;

        return formattedDate;
    }
}