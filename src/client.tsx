/** @jsxImportSource hono/jsx/dom */
import { useState, useRef } from 'hono/jsx/dom'
import { render } from 'hono/jsx/dom'

function App() {
    return (
        <>
            <header>
                <h2>住宅ローン簡易計算ツール</h2>
            </header>
            <HomeLoneCalculator />
            <footer>
                <p>This site is powered by 🔥Hono.</p>
            </footer>
        </>
    )
}

function calcMonthlyPayment(p: number, yearlyRate: number, n: number) {
    let ng = 0
    let ok = p * (10 ** 4) + 10 ** 5
    const monthlyRate = (yearlyRate / 100) / 12
    while (ok - ng > 0.0001) {
        // 残債
        let loanBalance = p * 10000
        // 下限と上限を足して２で割る
        const mid = (ok + ng) / 2
        for (let i = 0; i < n; i++) {
            for (let m = 0; m < 12; m++) {
                loanBalance -= mid
                loanBalance += loanBalance * monthlyRate
                if (loanBalance < 0) break
            }
        }
        // 返し過ぎているので上限を引き下げる
        if (loanBalance < 0) {
            ok = mid
            // 
        } else {
            ng = mid
        }
    }
    return Math.floor(ok)
}

function sumFirstElements(matrix: number[][]): number {
    let sum = 0;
    for (const row of matrix) {
        if (row.length > 0) {
            sum += row[0];
        }
    }
    return sum;
}

function HomeLoneCalculator() {
    const principalRef = useRef<HTMLInputElement>(null)
    const interestRateRef = useRef<HTMLInputElement>(null)
    const yearsRef = useRef<HTMLInputElement>(null)
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
    const [yearlyPayment, setYealyPayment] = useState<number>(0)
    const [schedule, setSchedule] = useState<[number, number][]>([])
    const [totalPayment, setTotalPayment] = useState<number>(0)
    const [paymentType, setPaymentType] = useState<string>('ganri');

    const handleCalculate = (e: Event) => {
        e.preventDefault()
        const principal = principalRef.current?.value || '0'
        const interestRate = interestRateRef.current?.value || '0'
        const years = yearsRef.current?.value || '0'

        const P = parseFloat(principal)
        const r = parseFloat(interestRate)
        const n = parseInt(years)

        if (isNaN(P) || isNaN(r) || isNaN(n)) {
            alert('全てのフィールドに正しい数値を入力してください')
            return
        }

        if (P <= 0 || r <= 0 || n <= 0) {
            alert('0より大きい数を入力してください')
            return
        }
        if (P > 100000) {
            alert('10億円以下の金額を入力してください')
            return
        }

        if (r > 10) {
            alert('利率は10％以下を入力してください')
            return
        }

        if (n > 100) {
            alert('期間は100年以下を入力してください')
            return
        }
        // ["返済額、残債"]
        const arr: [number, number][] = []
        const mRate = (r / 100) / 12
        if (paymentType === 'ganri') {
            const _monthlyPayment = calcMonthlyPayment(P, r, n)
            const _yealyPayment = _monthlyPayment * 12
            setMonthlyPayment(_monthlyPayment)
            setYealyPayment(_yealyPayment)
            let rem = P * 10000
            for (let i = 0; i < n; i++) {
                for (let m = 0; m < 12; m++) {
                    rem -= _monthlyPayment
                    rem += Math.floor(rem * mRate)
                }
                arr.push([_yealyPayment, rem])
            }
            // 最後の年を調整する
            arr[n - 1][0] += arr[n - 1][1]
            arr[n - 1][1] = 0

        } else {
            setMonthlyPayment(0)
            setYealyPayment(0)
            const basePayment = Math.floor((P * (10 ** 4)) / (n * 12))
            let rem = (P * 10 ** 4)
            let risoku = 0
            let yearlyP = 0
            for (let i = 0; i < n; i++) {
                yearlyP = basePayment * 12
                for (let m = 0; m < 12; m++) {
                    rem -= basePayment
                    risoku = Math.floor(rem * mRate)
                    yearlyP += risoku
                }
                arr.push([yearlyP, rem])
            }
            // 最後の年を調整する
            arr[n - 1][0] += arr[n - 1][1]
            arr[n - 1][1] = 0
        }
        setSchedule(arr)
        const tot = sumFirstElements(arr)
        setTotalPayment(tot)
        // コーナーケース
        if (n == 1) {
            setYealyPayment(tot)
        }
    }
    return (
        <div>
            <form onSubmit={handleCalculate}>
                <div>
                    <label>
                        借入金額(万円):
                    </label>
                    <input type="number" ref={principalRef} />
                </div>
                <div>
                    <label>
                        利率 (%):
                    </label>
                    <input type="number" ref={interestRateRef} />

                </div>
                <div>
                    <label>
                        期間 (年):
                    </label>
                    <input type="number" ref={yearsRef} />
                    <label>返済方式</label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="ganri"
                            checked={paymentType === 'ganri'}
                            onChange={() => setPaymentType('ganri')}
                        /> 元利均等
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="gankin"
                            checked={paymentType === 'gankin'}
                            onChange={() => setPaymentType('gankin')}
                        /> 元金均等
                    </label>
                </div>
                <div>
                    <button type='submit' onClick={handleCalculate}>計算</button>
                </div>
            </form>
            {totalPayment !== 0 && (
                <div>
                    {monthlyPayment !== 0 && (
                        <p>毎月の支払い額:<b>¥{monthlyPayment.toLocaleString()}</b></p>
                    )}
                    {yearlyPayment !== 0 && (
                        <p>年間の支払い額:<b>¥{yearlyPayment.toLocaleString()}</b></p>
                    )}
                    <p>合計の支払い額:<b>¥{totalPayment.toLocaleString()}</b></p>
                    <Schedule arr={schedule} />
                </div>
            )}
        </div>
    )
}

type ScheduleProps = {
    arr: [number, number][]
};

function Schedule({ arr }: ScheduleProps) {
    return (
        <details>
            <summary>返済スケジュール</summary>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>支払い額</th>
                        <th>残債</th>
                    </tr>
                </thead>
                <tbody>
                    {arr.map(([payment, balance], i) => (
                        <tr key={i}>
                            <td>{i + 1}年目</td>
                            <td>{payment.toLocaleString()}</td>
                            <td>{balance.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    )
}

const root = document.getElementById('root')!
render(<App />, root)