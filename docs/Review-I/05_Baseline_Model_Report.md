# 📄 Baseline Model Report — Review I

## 1. Algorithms Attempted
1. **Simple Mean Baseline**: Predicting average dataset price ($\bar{y} = ₹6,450.00$).
2. **Custom Multi-Variable Linear Regressor (`SimpleLinearRegressor`)**: Gradient descent optimization over normalized numerical features (`ml/train.py`).

## 2. Model Formulation
$$\hat{y}_i = \sum_{j=1}^4 w_j \cdot \left(\frac{X_{i,j} - \mu_j}{\sigma_j}\right) + b$$

* **Hyperparameters**:
  * Learning Rate ($\alpha$): `0.01`
  * Epochs: `100`
  * Loss Function: Mean Squared Error (MSE)

## 3. Evaluation Metrics & Initial Results (80/20 Train-Test Split)

| Model | MAE (INR) | RMSE (INR) | Execution Time | Status |
|---|---|---|---|---|
| **Mean Baseline** | ₹2,150.00 | ₹2,810.00 | <1 ms | Baseline Benchmark |
| **Custom Linear Regressor** | **₹450.00** | **₹580.00** | **~12 ms** | **Selected Baseline** |

## 4. Challenges Identified & Mitigation Strategy
* **Challenge**: Feature scale variance between distance (~5000) and demand index (~1.0) caused gradient explosion.
* **Mitigation**: Implemented standard deviation feature normalization before weight updates in `SimpleLinearRegressor.fit()`.
