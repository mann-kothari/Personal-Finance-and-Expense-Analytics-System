CREATE DATABASE fintrack;
USE fintrack;
SHOW DATABASES;
create table users( 
user_id bigint unsigned auto_increment primary key,
name varchar(100)not null,
email varchar(150) not null unique,
password_hash varchar(255) not null,
created_at timestamp default current_timestamp 
);
show tables;
describe users;
INSERT INTO users
(name, email, password_hash)
VALUES
('Rahul Sharma', 'rahul@gmail.com', 'dummy_hash');
select * from users;

create table accounts(
account_id bigint unsigned auto_increment primary key,
user_id bigint unsigned not null,
account_name varchar(100) not null,
account_type varchar(30)not null,
opening_balance decimal(15,2) not null default 0.00,
currency char(3) not null default 'INR',
created_at timestamp default current_timestamp,

constraint fk_accounts_user
foreign key(user_id)
references users(user_id)
);

show tables;

describe accounts;

CREATE TABLE categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

show tables;
select*from users;
INSERT INTO categories
(user_id, category_name, category_type)
VALUES
(1, 'Salary', 'INCOME'),
(1, 'Freelance', 'INCOME'),
(1, 'Food', 'EXPENSE'),
(1, 'Travel', 'EXPENSE'),
(1, 'Rent', 'EXPENSE'),
(1, 'Shopping', 'EXPENSE'),
(1, 'Entertainment', 'EXPENSE'),
(1, 'Bills', 'EXPENSE');

SELECT * FROM categories;

CREATE TABLE transactions (
    transaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,

    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    transaction_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT fk_transactions_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);

show tables;

INSERT INTO accounts
(
    user_id,
    account_name,
    account_type,
    opening_balance,
    currency
)
VALUES
(
    1,
    'HDFC Bank',
    'BANK',
    25000.00,
    'INR'
);

select * from accounts;

INSERT INTO transactions
(
    user_id,
    account_id,
    category_id,
    transaction_type,
    amount,
    description,
    transaction_date
)
VALUES
(
    1,
    1,
    3,
    'EXPENSE',
    500.00,
    'Lunch',
    '2026-09-11'
);

select* from transactions;
SELECT * FROM categories;

CREATE TABLE transfers (
    transfer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,
    source_account_id BIGINT UNSIGNED NOT NULL,
    destination_account_id BIGINT UNSIGNED NOT NULL,

    amount DECIMAL(15,2) NOT NULL,
    transfer_date DATE NOT NULL,
    description VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transfers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_transfer_source
        FOREIGN KEY (source_account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT fk_transfer_destination
        FOREIGN KEY (destination_account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT chk_transfer_amount
        CHECK (amount > 0),

    CONSTRAINT chk_transfer_different_accounts
        CHECK (source_account_id <> destination_account_id)
);

show tables;

INSERT INTO accounts
(
    user_id,
    account_name,
    account_type,
    opening_balance,
    currency
)
VALUES
(
    1,
    'SBI Bank',
    'BANK',
    10000.00,
    'INR'
);

SELECT * FROM accounts;

INSERT INTO transfers
(
    user_id,
    source_account_id,
    destination_account_id,
    amount,
    transfer_date,
    description
)
VALUES
(
    1,
    1,
    2,
    5000.00,
    '2026-09-11',
    'Transfer from HDFC to SBI'
);

SELECT * FROM transfers;

CREATE TABLE budgets (
    budget_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,

    budget_name VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_budgets_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_budgets_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id),

    CONSTRAINT chk_budget_amount
        CHECK (amount > 0),

    CONSTRAINT chk_budget_dates
        CHECK (end_date >= start_date)
);
show tables;

INSERT INTO budgets
(
    user_id,
    category_id,
    budget_name,
    amount,
    start_date,
    end_date
)
VALUES
(
    1,
    3,
    'September Food Budget',
    8000.00,
    '2026-09-01',
    '2026-09-30'
);

select * from budgets;
CREATE TABLE savings_goals (
    goal_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    goal_name VARCHAR(150) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    target_date DATE,
    description VARCHAR(255),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT chk_goal_target
        CHECK (target_amount > 0),

    CONSTRAINT chk_goal_current
        CHECK (current_amount >= 0),

    CONSTRAINT chk_goal_not_over_target
        CHECK (current_amount <= target_amount)
);

show tables;

INSERT INTO savings_goals
(
    user_id,
    goal_name,
    target_amount,
    current_amount,
    target_date,
    description
)
VALUES
(
    1,
    'New Laptop',
    80000.00,
    25000.00,
    '2027-03-31',
    'Saving for a new laptop'
);

select * from savings_goals;

SELECT COALESCE(SUM(amount), 0) AS total_income
FROM transactions
WHERE user_id = 1
  AND transaction_type = 'INCOME';

SELECT COALESCE(SUM(amount), 0) AS total_expense
FROM transactions
WHERE user_id = 1
  AND transaction_type = 'EXPENSE';
  
  SELECT
    COALESCE(SUM(
        CASE
            WHEN transaction_type = 'INCOME' THEN amount
            WHEN transaction_type = 'EXPENSE' THEN -amount
            ELSE 0
        END
    ), 0) AS net_savings
FROM transactions
WHERE user_id = 1;

SELECT
    COALESCE(SUM(
        CASE
            WHEN transaction_type = 'INCOME'
            THEN amount
            ELSE 0
        END
    ), 0) AS total_income,

    COALESCE(SUM(
        CASE
            WHEN transaction_type = 'EXPENSE'
            THEN amount
            ELSE 0
        END
    ), 0) AS total_expense,

    COALESCE(SUM(
        CASE
            WHEN transaction_type = 'INCOME'
            THEN amount
            WHEN transaction_type = 'EXPENSE'
            THEN -amount
            ELSE 0
        END
    ), 0) AS net_savings

FROM transactions
WHERE user_id = 1;

SELECT
    c.category_name,
    SUM(t.amount) AS total_spent
FROM transactions t
JOIN categories c
    ON t.category_id = c.category_id
WHERE t.user_id = 1
  AND t.transaction_type = 'EXPENSE'
GROUP BY
    c.category_id,
    c.category_name
ORDER BY total_spent DESC;

SELECT
    c.category_name,
    SUM(t.amount) AS total_spent,
    ROUND(
        SUM(t.amount) * 100 /
        (
            SELECT SUM(amount)
            FROM transactions
            WHERE user_id = 1
              AND transaction_type = 'EXPENSE'
        ),
        2
    ) AS expense_percentage
FROM transactions t
JOIN categories c
    ON t.category_id = c.category_id
WHERE t.user_id = 1
  AND t.transaction_type = 'EXPENSE'
GROUP BY
    c.category_id,
    c.category_name
ORDER BY total_spent DESC;

SHOW TABLES;
SELECT * FROM users;
SELECT * FROM accounts;
SELECT * FROM categories;
SELECT * FROM transactions;
SELECT * FROM transfers;
SELECT * FROM budgets;
SELECT * FROM savings_goals;

SELECT
    a.account_id,
    a.account_name,
    a.opening_balance
    +
    COALESCE(SUM(
        CASE
            WHEN t.transaction_type = 'INCOME' THEN t.amount
            WHEN t.transaction_type = 'EXPENSE' THEN -t.amount
            ELSE 0
        END
    ), 0) AS balance
FROM accounts a
LEFT JOIN transactions t
    ON a.account_id = t.account_id
WHERE a.user_id = 1
GROUP BY
    a.account_id,
    a.account_name,
    a.opening_balance;
    
    SELECT
    b.budget_name,
    c.category_name,
    b.amount AS budget_amount,

    COALESCE(SUM(t.amount), 0) AS actual_spending,

    b.amount - COALESCE(SUM(t.amount), 0) AS remaining_amount,

    ROUND(
        COALESCE(SUM(t.amount), 0) * 100 / b.amount,
        2
    ) AS utilization_percentage

FROM budgets b

JOIN categories c
    ON b.category_id = c.category_id

LEFT JOIN transactions t
    ON t.category_id = b.category_id
    AND t.user_id = b.user_id
    AND t.transaction_type = 'EXPENSE'
    AND t.transaction_date BETWEEN b.start_date AND b.end_date

WHERE b.user_id = 1

GROUP BY
    b.budget_id,
    b.budget_name,
    c.category_name,
    b.amount;
    
    SELECT
    DATE_FORMAT(transaction_date, '%Y-%m') AS month,

    SUM(
        CASE
            WHEN transaction_type = 'INCOME'
            THEN amount
            ELSE 0
        END
    ) AS total_income,

    SUM(
        CASE
            WHEN transaction_type = 'EXPENSE'
            THEN amount
            ELSE 0
        END
    ) AS total_expense,

    SUM(
        CASE
            WHEN transaction_type = 'INCOME'
            THEN amount
            WHEN transaction_type = 'EXPENSE'
            THEN -amount
            ELSE 0
        END
    ) AS net_savings

FROM transactions

WHERE user_id = 1

GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')

ORDER BY month;

USE fintrack;

CREATE INDEX idx_transactions_user_date
ON transactions(user_id, transaction_date);

CREATE INDEX idx_transactions_category
ON transactions(category_id);

CREATE INDEX idx_transactions_account
ON transactions(account_id);

CREATE INDEX idx_transfers_user_date
ON transfers(user_id, transfer_date);

CREATE INDEX idx_budgets_user_category
ON budgets(user_id, category_id);

CREATE INDEX idx_goals_user
ON savings_goals(user_id);

SHOW INDEX FROM transactions;

SHOW INDEX FROM accounts;
SHOW INDEX FROM budgets;

SHOW CREATE TABLE transactions;

SHOW CREATE TABLE transfers;

