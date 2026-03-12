#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <windows.h>

typedef int t;
typedef struct node_tag {
    t value; // значение
    struct node_tag *next;
} node;

void push(node **head, t value) {
    node *tmp = malloc(sizeof(node));
    tmp->next = *head;
    tmp->value = value;
    *head = tmp;
}
t pop(node **head) {
    node *out;
    t value;
    out = *head;
    *head = (*head)->next;
    value = out->value;
    free(out);
    return value;
}
void clear(node **head) {
    node *out;
    t value;
    out = *head;
    *head = (*head)->next;
    value = out->value;
    free(out);
}
bool isEmpty(node **head) {
    if (getsize(head) == 0) return true;
    else return false;
}
void display(const node* head) {
    printf("Стек:\n");
    while (head) {
            printf("%d\n", head->value);
            head = head->next;
    }
}
t getsize(const node *head) {
    t size = 0;
    while (head) {
            size++;
            head = head->next;
    }
    return size;
}
void push_mid(node *head, t value) {
    t size = getsize(head) / 2;
    t elem;
    node *tmp = NULL;
    for (int i = 0; i < size; i++) {
        elem = head->value;
        pop(&head);
        push(&tmp, elem);
    }
    push(&head, value);
    unload_stack(head, tmp);
}
void push_end(node *head, t value) {
    t size = getsize(head);
    t elem;
    node *tmp = NULL;
    for (int i = 0; i < size; i++) {
        elem = head->value;
        pop(&head);
        push(&tmp, elem);
    }
    push(&head, value);
    for (int i = 0; i < size; i++) {
        elem = tmp->value;
        pop(&tmp);
        push(&head, elem);
    }
}
void unload_stack(node *head, node *tmp) { 
    t size = getsize(tmp);
    t elem;
    for (int i = 0; i < size; i++) {
        elem = tmp->value;
        pop(&tmp);
        push(&head, elem);
    }
}
t stack_sum(node *head) {
    t size = getsize(head);
    t summ = 0, elem;
    node *tmp = NULL;
    for (int i = 0; i < size; i++) {
        elem = head->value;
        pop(&head);
        push(&tmp, elem);
    }
    for (int i = 0; i < size; i++) {
        elem = tmp->value;
        summ = summ + elem;
        pop(&tmp);
        push(&head, elem);    
    }
    return summ;
}
t stack_mult(node *head) {
    t size = getsize(head);
    t summ = 1, elem;
    node *tmp = NULL;
    for (int i = 0; i < size; i++) {
        elem = head->value;
        pop(&head);
        push(&tmp, elem);
    }
    for (int i = 0; i < size; i++) {
        elem = tmp->value;
        summ = summ * elem;
        pop(&tmp);
        push(&head, elem);    
    }
    return summ;
}
void arrow(int realpos, int arrowpos) { 
    if (realpos == arrowpos) printf(" >>> ");
    else printf("     ");
}
void menu() {
    system("cls");
    node *head = NULL;
    t summ, push_num;
    int pos = 1;
    int keypressed = 0;
    #define MAX 6
    #define MIN 1

    while (keypressed != 27) {
        system("cls");
        arrow(1,pos); printf("1. Вставка (push)\n");
        arrow(2,pos); printf("2. Достать элемент сверху (pop)\n");
        arrow(3,pos); printf("3. Отображение стека\n");
        arrow(4,pos); printf("4. Очистка стека\n");
        arrow(5,pos); printf("5. Узнать размер\n");
        arrow(6,pos); printf("6. Умножить/сложить все элементы и поместить результат в начало/середину/конец стека\n");
        keypressed = getch();
        if (keypressed == 80 && pos != MAX) pos++;
        else if (keypressed == 72 && pos != MIN) pos--;
        if (keypressed == 13) {
            switch (pos) {
                case 1: {
                    system("cls");
                    printf("Введите число\n");
                    scanf("%d", &push_num);
                    push(&head, push_num);
                    system("pause");
                    break;
                }
                case 2: {
                    system("cls");
                    if (getsize(head) == 0) printf("Стек пуст\n");
                    else printf("Изъятый элемент: %d\n", pop(&head));
                    system("pause");
                    break;
                }
                case 3: {
                    system("cls");
                    display(head);
                    system("pause");
                    break;
                }
                case 4: {
                    system("cls");
                    while (getsize(head) > 0) clear(&head);
                    printf("Стек очищен\n");
                    system("pause");
                    break;
                }
                case 5: {
                    system("cls");
                    printf("Размер = %d\n", getsize(head));
                    system("pause");
                    break;
                }
                case 6: {
                    system("cls");
                    int pos2 = 1;
                    int max2 = 2, min2 = 1;
                    t summa;
                    bool flag = false;
                    while (keypressed != 27 && flag == false) {
                        system("cls");
                        arrow(1, pos2); printf("1. Сложить\n");
                        arrow(2, pos2); printf("2. Умножить\n");
                        keypressed = getch();
                        if (keypressed == 80 && pos2 != max2) pos2++;
                        else if (keypressed == 72 && pos2 != min2) pos2--;
                        if (keypressed == 13) {
                            switch (pos2) {
                                case 1: {
                                    system("cls");
                                    summa = stack_sum(head);
                                    printf("Сумма всех элементов стека = %d\n", summa);
                                    flag = true;
                                    system("pause");
                                    break;
                                }
                                case 2: {
                                    system("cls");
                                    summa = stack_mult(head);
                                    printf("Произведение всех элементов стека = %d\n", summa);
                                    flag = true;
                                    system("pause");
                                    break;
                                }
                            }
                        }
                    }
                    pos2 = 1;
                    max2 = 3;
                    flag = false;
                    while (keypressed != 27 && flag == false) {
                        system("cls");
                        printf("Результат = %d\n", summa);
                        arrow(1, pos2); printf("1. Вставить в начало\n");
                        arrow(2, pos2); printf("2. Вставить в середину\n");
                        arrow(3, pos2); printf("3. Вставить в конец\n");
                        keypressed = getch();
                        if (keypressed == 80 && pos2 != max2) pos2++;
                        else if (keypressed == 72 && pos2 != min2) pos2--;
                        if (keypressed == 13) {
                            switch (pos2) {
                                case 1: {
                                    system("cls");
                                    push(&head, summa);
                                    flag = true;
                                    printf("Выполнено!\n");
                                    system("pause");
                                    break;
                                }
                                case 2: {
                                    system("cls");
                                    push_mid(head, summa);
                                    flag = true;
                                    printf("Выполнено!\n");
                                    system("pause");
                                    break;
                                }
                                case 3: {
                                    system("cls");
                                    push_end(head, summa);
                                    flag = true;
                                    printf("Выполнено!\n");
                                    system("pause");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
int main() {
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    menu();
    return 0;
}