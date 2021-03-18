import logging
import os
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont

__all__ = ["Avatar"]
log = logging.getLogger("cropontology")


class Avatar(object):
    FONT_COLOR = (255, 255, 255)
    MIN_RENDER_SIZE = 512

    @classmethod
    def generate(cls, size, string, filetype="JPEG"):
        """
        Generates a squared avatar with random background color.

        :param size: size of the avatar, in pixels
        :param string: string to be used to print text and seed the random
        :param filetype: the file format of the image (i.e. JPEG, PNG)
        """
        render_size = max(size, Avatar.MIN_RENDER_SIZE)
        image = Image.new("RGB", (render_size, render_size), cls._background_color())
        draw = ImageDraw.Draw(image)
        font = cls._font(render_size)
        text = cls._text(string)
        draw.text(
            cls._text_position(render_size, text, font),
            text,
            fill=cls.FONT_COLOR,
            font=font,
        )
        stream = BytesIO()
        image = image.resize((size, size), Image.ANTIALIAS)
        image.save(stream, format=filetype, optimize=True)
        return stream.getvalue()

    @staticmethod
    def _background_color():
        """
        Generate a random background color.
        Brighter colors are dropped, because the text is white.
        """
        # r = v = b = 255
        # while r + v + b > 255 * 2:
        #     r = randint(0, 255)
        #     v = randint(0, 255)
        #     b = randint(0, 255)
        return 2, 106, 168

    @staticmethod
    def _font(size):
        """
        Returns a PIL ImageFont instance.

        :param size: size of the avatar, in pixels
        """
        path = os.path.join(os.path.dirname(__file__), "data", "unifont-13.0.01.ttf")
        return ImageFont.truetype(path, size=int(0.4 * size))

    @staticmethod
    def _text(string):
        """
        Returns the text to draw.
        """
        try:
            if len(string) == 0:
                return "#"
            elif len(string) <= 3:
                return string.upper()
            else:
                part = string.split()
                if len(part) == 1:
                    data = part[0]
                    if len(data) >= 3:
                        return (
                            part[0][0].upper() + part[0][1].upper() + part[0][2].upper()
                        )
                    else:
                        if len(data) == 2:
                            return part[0][0].upper() + part[0][1].upper()
                        else:
                            return part[0][0].upper()
                else:
                    if len(part) == 2:
                        return part[0][0].upper() + part[1][0].upper()
                    else:
                        return (
                            part[0][0].upper() + part[1][0].upper() + part[2][0].upper()
                        )
        except Exception as e:
            log.error(
                "Error creating avatar for string {}. Error: {}".format(string, str(e))
            )
            return "#"

    @staticmethod
    def _text_position(size, text, font):
        """
        Returns the left-top point where the text should be positioned.
        """
        width, height = font.getsize(text)
        left = (size - width) / 2.0
        top = (size - height) / 2.3
        return left, top
