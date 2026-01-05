import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>💰 Expense Tracker</h1>
      
      <!-- Summary Cards -->
      <div class="summary">
        <div class="card income-card">
          <h3>Income</h3>
          <p class="amount">$\{{ totalIncome }}</p>
        </div>
        <div class="card expense-card">
          <h3>Expenses</h3>
          <p class="amount">$\{{ totalExpense }}</p>
        </div>
        <div class="card balance-card">
          <h3>Balance</h3>
          <p class="amount">$\{{ balance }}</p>
        </div>
      </div>

      <!-- Add Transaction Form -->
      <div class="form-container">
        <h2>Add Transaction</h2>
        <form (ngSubmit)="addTransaction()">
          <input 
            type="text" 
            [(ngModel)]="newTransaction.description" 
            name="description"
            placeholder="Description (e.g., Salary, Groceries)"
            required
          />
          
          <input 
            type="number" 
            [(ngModel)]="newTransaction.amount" 
            name="amount"
            placeholder="Amount"
            step="0.01"
            required
          />
          
          <select [(ngModel)]="newTransaction.type" name="type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      <!-- Transactions List -->
      <div class="transactions">
        <h2>Transaction History</h2>
        <div *ngIf="transactions.length === 0" class="empty-state">
          No transactions yet. Add your first transaction above!
        </div>
        <div 
          *ngFor="let transaction of transactions" 
          class="transaction-item"
          [class.income]="transaction.type === 'income'"
          [class.expense]="transaction.type === 'expense'"
        >
          <div class="transaction-info">
            <strong>{{ transaction.description }}</strong>
            <small>{{ transaction.date | date:'short' }}</small>
          </div>
          <div class="transaction-amount">
            <span [class.positive]="transaction.type === 'income'" 
                  [class.negative]="transaction.type === 'expense'">
              {{ transaction.type === 'income' ? '+' : '-' }}$\{{ transaction.amount }}
            </span>
            <button (click)="deleteTransaction(transaction.id)" class="delete-btn">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      text-align: center;
      color: #333;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 30px 0;
    }

    .card {
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .income-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .expense-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .balance-card {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .amount {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }

    .form-container {
      background: #f9f9f9;
      padding: 25px;
      border-radius: 10px;
      margin: 30px 0;
    }

    .form-container h2 {
      margin-top: 0;
      color: #333;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    input, select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }

    button[type="submit"] {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button[type="submit"]:hover {
      background: #5568d3;
    }

    .transactions h2 {
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
      font-style: italic;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      background: white;
      border-left: 4px solid #ddd;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .transaction-item.income {
      border-left-color: #667eea;
    }

    .transaction-item.expense {
      border-left-color: #f5576c;
    }

    .transaction-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .transaction-info strong {
      color: #333;
    }

    .transaction-info small {
      color: #999;
      font-size: 12px;
    }

    .transaction-amount {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .positive {
      color: #667eea;
      font-weight: bold;
      font-size: 18px;
    }

    .negative {
      color: #f5576c;
      font-weight: bold;
      font-size: 18px;
    }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .delete-btn:hover {
      opacity: 1;
    }
  `]
})
export class ExpenseTrackerComponent {
  transactions: Transaction[] = [];
  nextId = 1;

  newTransaction = {
    description: '',
    amount: 0,
    type: 'expense' as 'income' | 'expense'
  };

  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  addTransaction() {
    if (this.newTransaction.description && this.newTransaction.amount > 0) {
      this.transactions.push({
        id: this.nextId++,
        description: this.newTransaction.description,
        amount: this.newTransaction.amount,
        type: this.newTransaction.type,
        date: new Date()
      });

      // Reset form
      this.newTransaction = {
        description: '',
        amount: 0,
        type: 'expense'
      };
    }
  }

  deleteTransaction(id: number) {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }
}