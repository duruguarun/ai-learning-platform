from manim import *

class BubbleSortScene(Scene):
    def construct(self):
        array = [5, 1, 4, 2, 8]
        n = len(array)
        boxes = VGroup(*[Square(side_length=1).shift(RIGHT * i) for i in range(n)])
        labels = VGroup(*[Text(str(val), font_size=24).move_to(boxes[i]) for i, val in enumerate(array)])
        array_group = VGroup(boxes, labels).scale(0.8).shift(UP)

        self.play(Create(array_group))
        self.wait()

        for i in range(n):
            for j in range(0, n - i - 1):
                # Highlight current pair
                current_boxes = VGroup(boxes[j], boxes[j + 1])
                current_boxes.set_fill(BLUE, opacity=0.5)
                self.play(FadeIn(current_boxes), run_time=0.5)

                # Wait for comparison
                self.wait(0.5)

                if array[j] > array[j + 1]:
                    # Swap values in array
                    array[j], array[j + 1] = array[j + 1], array[j]
                    # Swap labels
                    labels[j], labels[j + 1] = labels[j + 1], labels[j]
                    # Animate swap
                    self.play(
                        labels[j].animate.move_to(labels[j + 1]),
                        labels[j + 1].animate.move_to(labels[j]),
                        run_time=0.5
                    )
                    self.wait(0.5)

                # Unhighlight after comparison
                current_boxes.set_fill(opacity=0)
                self.play(FadeOut(current_boxes), run_time=0.5)

        # Final sorted array becomes green
        boxes.set_fill(GREEN, opacity=0.3)
        self.play(FadeIn(boxes), run_time=0.5)
        self.wait(2)