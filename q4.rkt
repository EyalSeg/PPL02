#lang racket
(provide (all-defined-out))

;; Add a contract here
(define shift-left
  (lambda (ls)
    (if (empty? ls)
       '()
       (append (cdr ls) (cons (car ls) null)) ;check why cons
        )
    ))

(shift-left '(1 2 3 4 5))

;; Add a contract here
(define shift-k-left
  (lambda (ls k)
    (if (equal? k 0)
        ls
        (shift-k-left (shift-left ls) (- k 1))) ;by adding round brackets you evaluate 
        )
     )

(shift-k-left '(1 2 3 4 5) 3)


;; Add a contract here
(define shift-right
  (lambda (ls)
      (if (empty? ls)
       '()
       (append (cons (last (cdr ls)) null) (take ls (- (length ls) 1))) ;check why cons
        )
    ))

;(shift-right '(1 2 3 4 5))
;; Add a contract here
;(define combine
 ; (lambda (ls1 ls2)
 ;   (cond
   ;   [(empty? ls1) ls2]
    ;  [(empty? ls2) ls1]
     ; [else (append(append(cons(car ls1) null)(cons(car ls2) null))(combine (cdr ls1) (cdr ls2)))]  
    ;   )
   ; ))

;(combine '(1 3) '(2 4))

(define combine
  (lambda (ls1 ls2)
    (cond
      [(empty? ls1) ls2]
      [(empty? ls2) ls1]
      [else (let ([head (cons (car ls1) (cons (car ls2) '())) ])
              (let ([tail (combine (cdr ls1) (cdr ls2))])
                   (append head tail)
              ))]
    )
))

(combine '(1 2 3) '(a b c))
;; Add a contract here
(define sum-tree
  (lambda (tree)
    (if (empty? tree)
        0
        (foldl (lambda (value acc)(+ acc (sum-tree value)))
               (car tree)
               (cdr tree))
    ))
  )
;; Add a contract here
(define inverse-tree
  (lambda (tree)
    (if (empty? tree)
        '()
        (let ([children (map inverse-tree (cdr tree))])
          (if (boolean? (car tree))
              (append (cons (not (car tree)) null) children)
              (append (cons (* (car tree) -1) null) children)
          )
        )
)))


(inverse-tree '())
